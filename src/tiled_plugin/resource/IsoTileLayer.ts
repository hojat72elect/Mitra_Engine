import {Color} from "../../engine/color";
import {Logger} from "../../engine/util/log";
import {ParallaxComponent} from "../../engine/graphics/ParallaxComponent";
import {mapProps, type PropertyMapValue} from "./Properties";
import {isCSV, isInfiniteLayer, needsDecoding, TiledTileLayer} from "../parser/TiledParser";
import {Decoder} from "./Decoder";
import {TiledResource} from "./TiledResource";
import {getCanonicalGid} from "./gid-util";
import {MitraTiledProperties} from "./MitraTiledProperties";
import {TiledLayerDataComponent} from "./TiledLayerDataComponent";
import type {Layer} from "./Layer";
import {Tile} from "./Tileset";
import {byClassCaseInsensitive, byProperty, byPropertyValueMatcher} from "./filter-util";
import {AnimationStrategy} from "../../engine/graphics/AnimationStrategy";
import {BodyComponent} from "../../engine/collision/BodyComponent";
import {IsometricMap, type IsometricTile} from "../../engine/tile-map/IsometricMap.ts";
import {vec, type Vector} from "../../engine/math/Vector.ts";
import {IsometricEntityComponent} from "../../engine/tile-map/IsometricEntityComponent.ts";

export interface IsometricTileInfo {
    /**
     * Tiled based information for the tile
     */
    tiledTile?: Tile;
    /**
     * Mitra tile abstraction
     */
    exTile: IsometricTile;
}

export class IsoTileLayer implements Layer {
    /**
     * Numeric id given by Tiled
     */
    public readonly id: string | number;
    public readonly name: string;
    class?: string | undefined;
    /**
     * Number of tiles wide
     */
    public readonly width: number = 0;
    /**
     * Number of tiles high
     */
    public readonly height: number = 0;
    /**
     * Whether the tile layer is visible in the original map
     */
    public readonly visible: boolean;
    properties = new Map<string, PropertyMapValue>();
    /**
     * Original list of gids for this layer from tiled
     */
    data: number[] = [];
    /**
     * Mitra IsometricMap structure for drawing in Mitra.
     */
    isometricMap!: IsometricMap;
    tiledTileLayer: TiledTileLayer;
    resource: TiledResource;
    order: number;
    private logger = Logger.getInstance();
    /**
     * Chunk data for infinite maps by tile
     */
    private _tileToChunkData = new WeakMap<IsometricTile, number[]>;
    /**
     * Chunk index for infinite maps by tile
     */
    private _tileToChunkIndex = new WeakMap<IsometricTile, number>;
    private _gidToTileInfo = new Map<number, IsometricTileInfo[]>();

    constructor(tiledTileLayer: TiledTileLayer, resource: TiledResource, order: number) {
        this.tiledTileLayer = tiledTileLayer;
        this.resource = resource;
        this.order = order;

        this.name = tiledTileLayer.name;
        this.id = tiledTileLayer.id;
        this.class = tiledTileLayer.class;
        this.width = tiledTileLayer.width;
        this.height = tiledTileLayer.height;
        this.visible = !!tiledTileLayer.visible;
        mapProps(this, tiledTileLayer.properties);
    }

    private _isInfinite = false;

    public get isInfinite(): boolean {
        return this._isInfinite;
    }

    /**
     * Returns the Mitra tiles that match a tiled property and optional value
     * @param name
     * @param value
     * @param [valueMatchInsensitive=true]
     */
    getTilesByProperty(name: string, value?: any, valueMatchInsensitive = true): IsometricTileInfo[] {
        const tiles = this.isometricMap.tiles.filter(t => {
            const maybeTiled = t.data.get(MitraTiledProperties.TileData.Tiled) as Tile | undefined;
            if (maybeTiled) {
                return byProperty(name, value, valueMatchInsensitive)(maybeTiled);
            }
            return false;
        });

        return tiles.map(t => ({
            exTile: t,
            tiledTile: t.data.get(MitraTiledProperties.TileData.Tiled)
        }))
    }

    /**
     * Get the tiles that match the property name and the value matcher returns true
     * @param name
     * @param valueMatcher
     */
    getTilesByPropertyValueMatcher(name: string, valueMatcher: (val: any) => boolean): IsometricTileInfo[] {
        const tiles = this.isometricMap.tiles.filter(t => {
            const maybeTiled = t.data.get(MitraTiledProperties.TileData.Tiled) as Tile | undefined;
            if (maybeTiled) {
                return byPropertyValueMatcher(name, valueMatcher)(maybeTiled);
            }
            return false;
        });

        return tiles.map(t => ({
            exTile: t,
            tiledTile: t.data.get(MitraTiledProperties.TileData.Tiled)
        }))
    }


    /**
     * Returns the Mitra tiles that match a tiled gid
     */
    getTilesByGid(gid: number): IsometricTileInfo[] {
        return this._gidToTileInfo.get(gid) ?? [];
    }

    /**
     * Returns the Mitra tiles that match a tiled class name
     * @param className
     */
    getTilesByClassName(className: string): IsometricTileInfo[] {
        const tiles = this.isometricMap.tiles.filter(t => {
            const maybeTiled = t.data.get(MitraTiledProperties.TileData.Tiled) as Tile | undefined;
            if (maybeTiled) {
                return byClassCaseInsensitive(className)(maybeTiled);
            }
            return false;
        });

        return tiles.map(t => ({
            exTile: t,
            tiledTile: t.data.get(MitraTiledProperties.TileData.Tiled)
        }))
    }

    getTileByPoint(worldPos: Vector): IsometricTileInfo | null {
        if (!this.isometricMap) {
            this.logger.warn('IsometricMap has not yet been loaded! getTileByPoint() will only return null');
            return null;
        }
        if (this.isometricMap) {
            const exTile = this.isometricMap.getTileByPoint(worldPos);
            if (!exTile) return null;

            const gid = this._getGidForTile(exTile);

            let tiledTile: Tile | undefined;
            if (gid > 0) {
                const tileset = this.resource.getTilesetForTileGid(gid);
                tiledTile = tileset.getTileByGid(gid);
            }

            return {tiledTile, exTile};
        }
        return null;
    }

    getTileByCoordinate(x: number, y: number): IsometricTileInfo | null {
        if (!this.isometricMap) {
            this.logger.warn('IsometricMap has not yet been loaded! getTileByCoordinate() will only return null');
            return null;
        }

        if (this.isometricMap) {
            const startx = isInfiniteLayer(this.tiledTileLayer) ? this.tiledTileLayer.startx : 0;

            const starty = isInfiniteLayer(this.tiledTileLayer) ? this.tiledTileLayer.starty : 0;
            const exTile = this.isometricMap.getTile(x - startx, y - starty)!;
            if (!exTile) return null;

            const gid = this._getGidForTile(exTile);

            let tiledTile: Tile | undefined;
            if (gid > 0) {
                const tileset = this.resource.getTilesetForTileGid(gid);
                tiledTile = tileset.getTileByGid(gid);
            }

            return {tiledTile, exTile};
        }

        return null;
    }

    async load(): Promise<void> {
        const maybeLayerConfig = this.resource.getLayerConfig(this.name) ||
            this.resource.getLayerConfig(this.id);
        const layer = this.tiledTileLayer;
        const isSolidLayer = !!this.properties.get(MitraTiledProperties.Layer.Solid);
        const opacity = this.tiledTileLayer.opacity;
        const hasTint = !!this.tiledTileLayer.tintcolor;
        const tint = this.tiledTileLayer.tintcolor ? Color.fromHex(this.tiledTileLayer.tintcolor) : Color.Transparent;
        const pos = vec(layer.offsetx ?? 0, layer.offsety ?? 0);
        if (this.tiledTileLayer.data && needsDecoding(this.tiledTileLayer)) {
            this.data = await Decoder.decode(this.tiledTileLayer.data, this.tiledTileLayer.compression);
        } else if (this.tiledTileLayer.data && isCSV(this.tiledTileLayer)) {
            this.data = this.tiledTileLayer.data;
        }

        let order = this.order;
        let zoverride = this.properties.get(MitraTiledProperties.ZIndex.ZIndex) as number | undefined;
        if (typeof zoverride === 'number') {
            order = zoverride;
        }

        if (this.resource.map.infinite && isInfiniteLayer(this.tiledTileLayer)) {
            const start = this.resource.isometricTiledCoordToWorld(this.tiledTileLayer.startx, this.tiledTileLayer.starty);
            const infiniteStartPos = vec(
                start.x * this.resource.map.tilewidth,
                start.y * this.resource.map.tileheight);
            this.isometricMap = new IsometricMap({
                name: this.name,
                pos: pos.add(infiniteStartPos),
                tileHeight: this.resource.map.tileheight,
                tileWidth: this.resource.map.tilewidth,
                columns: layer.width,
                rows: layer.height,
                elevation: order
            });
            if (maybeLayerConfig?.collisionGroup) {
                const body = this.isometricMap.get(BodyComponent);
                body.group = maybeLayerConfig.collisionGroup;
            }
        } else {
            this.isometricMap = new IsometricMap({
                name: this.name,
                pos,
                tileWidth: this.resource.map.tilewidth,
                tileHeight: this.resource.map.tileheight,
                columns: layer.width,
                rows: layer.height,
                elevation: order
            });
            if (maybeLayerConfig?.collisionGroup) {
                const body = this.isometricMap.get(BodyComponent);
                body.group = maybeLayerConfig.collisionGroup;
            }
        }

        // TODO make these optional params in the ctor
        this.isometricMap.isVisible = this.tiledTileLayer.visible;
        this.isometricMap.opacity = this.tiledTileLayer.opacity;
        this.isometricMap.addComponent(new TiledLayerDataComponent({tiledTileLayer: layer}));
        if (layer.parallaxx || layer.parallaxy) {
            const factor = vec(layer.parallaxx ?? 1, layer.parallaxy ?? 1);
            this.isometricMap.addComponent(new ParallaxComponent(factor));
        }

        if (this.resource.map.infinite && isInfiniteLayer(this.tiledTileLayer)) {
            this._isInfinite = true;
            const tileLayer = this.tiledTileLayer;
            for (let chunk of this.tiledTileLayer.chunks) {
                let chunkData: number[] = [];
                if (needsDecoding(this.tiledTileLayer)) {
                    chunkData = await Decoder.decode(chunk.data as unknown as string, tileLayer.compression);
                } else if (isCSV(this.tiledTileLayer)) {
                    chunkData = chunk.data as number[];
                }
                for (let i = 0; i < chunkData.length; i++) {
                    const gid = chunkData[i];

                    // Map from chunk to big tile map
                    const tileX = (i % chunk.width) + (chunk.x - this.tiledTileLayer.startx);
                    const tileY = Math.floor(i / chunk.width) + (chunk.y - this.tiledTileLayer.starty);
                    const tile = this.isometricMap.tiles[tileX + tileY * layer.width];

                    // keep chunk data for tiles per map
                    this._tileToChunkData.set(tile, chunkData);
                    this._tileToChunkIndex.set(tile, i);
                    if (gid != 0) {
                        this.updateTile(tile, gid, hasTint, tint, isSolidLayer);
                    }
                }
            }
        } else {
            // Read tiled data into Mitra's tilemap type
            for (let i = 0; i < this.data.length; i++) {
                let gid = this.data[i];
                if (gid !== 0) {
                    const tile = this.isometricMap.tiles[i];
                    this.updateTile(tile, gid, hasTint, tint, isSolidLayer);
                }
            }
        }
    }

    private _getGidForTile(exTile: IsometricTile): number {
        let gid = 0;
        if (this._isInfinite) {
            const chunkData = this._tileToChunkData.get(exTile);
            const chunkIndex = this._tileToChunkIndex.get(exTile);

            // Actually not an error, Tiled packs these sparsely so it's very possible they're missing
            if (chunkIndex == null || !chunkData) return gid;

            gid = getCanonicalGid(chunkData[chunkIndex]);

        } else {
            const tileIndex = this.isometricMap.tiles.indexOf(exTile);
            gid = getCanonicalGid(this.data[tileIndex]);
        }
        return gid;
    }

    private _recordTileData(gid: number, tile: IsometricTile) {
        let tiles: IsometricTileInfo[] | undefined = this._gidToTileInfo.get(gid);
        let tileset = this.resource.getTilesetForTileGid(gid);
        let maybeTile = tileset.getTileByGid(gid);
        if (!tiles) {
            tiles = [{exTile: tile, tiledTile: maybeTile}];
        } else {
            tiles.push({exTile: tile, tiledTile: maybeTile});
        }
        this._gidToTileInfo.set(gid, tiles);
        tile.data.set(MitraTiledProperties.TileData.Tiled, maybeTile);
    }

    private updateTile(tile: IsometricTile, gid: number, hasTint: boolean, tint: Color, isSolidLayer: boolean) {
        this._recordTileData(gid, tile);
        const maybeLayerConfig = this.resource.getLayerConfig(this.name) ||
            this.resource.getLayerConfig(this.id);
        if (maybeLayerConfig?.isSolid !== undefined) {
            isSolidLayer = maybeLayerConfig.isSolid;
        }
        if (this.resource.useMitraWiring && isSolidLayer) {
            tile.solid = true;
        }

        const iso = tile.get(IsometricEntityComponent);
        if (iso) {
            iso.elevation = this.order;
        }

        const tileset = this.resource.getTilesetForTileGid(gid);
        let sprite = tileset.getSpriteForGid(gid);
        if (hasTint) {
            sprite = sprite.clone();
            sprite.tint = tint;
        }
        tile.addGraphic(sprite, {offset: tileset.tileOffset});

        let offset = tile.pos;
        if (tileset.orientation === 'orthogonal') {
            // Odd rendering case when mixing/matching iso maps with orthogonal tilesets
            offset = vec(0, 0);
        } else {
            const halfWidth = this.resource.map.tilewidth / 2;
            const height = this.resource.map.tileheight;
            offset = vec(halfWidth, height);
        }

        // the whole tilemap uses a giant composite collider relative to the Tilemap
        // not individual tiles
        const colliders = tileset.getCollidersForGid(gid, {offset});
        for (let collider of colliders) {
            tile.addCollider(collider);
        }
        if (maybeLayerConfig?.useTileColliders && colliders.length > 0) {
            if (this.visible) {
                tile.solid = true;
            }
        }
        if (maybeLayerConfig?.useTileCollidersWhenInvisible && colliders.length > 0) {
            tile.solid = true;
        }

        let animation = tileset.getAnimationForGid(gid);
        if (animation) {
            if (hasTint) {
                animation = animation.clone();
                animation.tint = tint;
            }
            tile.clearGraphics();
            tile.addGraphic(animation, {offset: tileset.tileOffset});
            if (this.resource.useMitraWiring) {
                const tileObj = tileset.getTileByGid(gid);
                const strategy = tileObj?.properties.get(MitraTiledProperties.Animation.Strategy);
                if (strategy && typeof strategy === 'string') {
                    switch (strategy.toLowerCase()) {
                        case AnimationStrategy.End.toLowerCase(): {
                            animation.strategy = AnimationStrategy.End;
                            break;
                        }
                        case AnimationStrategy.Freeze.toLowerCase(): {
                            animation.strategy = AnimationStrategy.Freeze;
                            break;
                        }
                        case AnimationStrategy.Loop.toLowerCase(): {
                            animation.strategy = AnimationStrategy.Loop;
                            break;
                        }
                        case AnimationStrategy.PingPong.toLowerCase(): {
                            animation.strategy = AnimationStrategy.PingPong;
                            break;
                        }
                        default: {
                            // unknown animation strategy
                            this.logger.warn(`Unknown animation strategy in tileset ${tileset.name} on tile gid ${gid}: ${strategy}`);
                            break;
                        }
                    }
                }
            }
        }
    }
}
