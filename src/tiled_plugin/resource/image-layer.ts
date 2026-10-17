import { Actor, Color, ImageSource, ParallaxComponent, Vector, vec } from "../../engine";
import type {Layer} from "./layer";
import type {TiledImageLayer} from "../parser/tiled-parser";
import { TiledResource } from "./tiled-resource";
import { mapProps, type PropertyMapValue } from "./properties";
import { pathRelativeToBase } from "./path-util";

export class ImageLayer implements Layer {
   tiledImageLayer: TiledImageLayer;
   resource: TiledResource;
   order: number;
   public readonly name: string;
   public readonly class?: string;
   properties = new Map<string, PropertyMapValue>();
   image: ImageSource | null = null;
   imageActor: Actor | null = null;

   constructor(tiledImageLayer: TiledImageLayer, resource: TiledResource, order: number) {
      this.tiledImageLayer = tiledImageLayer;
      this.resource = resource;
      this.order = order;
      this.name = tiledImageLayer.name;
      this.class = tiledImageLayer.class;
      mapProps(this, tiledImageLayer.properties);
      if (tiledImageLayer.image) {
         this.image = new ImageSource(pathRelativeToBase(this.resource.path, tiledImageLayer.image, this.resource.pathMap))
      }
   }
   async load(): Promise<void> {
      const opacity = this.tiledImageLayer.opacity;
      const hasTint = !!this.tiledImageLayer.tintcolor;
      const tint = this.tiledImageLayer.tintcolor ? Color.fromHex(this.tiledImageLayer.tintcolor) : Color.White;
      const offset = vec(this.tiledImageLayer.offsetx ?? 0, this.tiledImageLayer.offsety ?? 0);
      const parallaxx = this.tiledImageLayer.parallaxx ?? 1;
      const parallaxy = this.tiledImageLayer.parallaxy ?? 1;
      if (this.image) {
         if (!this.resource.headless) {
            await this.image.load();
         }
         this.imageActor = new Actor({
            name: this.tiledImageLayer.name,
            pos: offset,
            anchor: Vector.Zero,
            z: this.order
         });
         this.imageActor.addComponent(new ParallaxComponent(vec(parallaxx, parallaxy)))
         // FIXME when Mitra supports tiling we should use it here for repeatx/repeaty!
         const sprite = this.image.toSprite();
         this.imageActor.graphics.use(sprite);
         this.imageActor.graphics.isVisible = this.tiledImageLayer.visible;
         this.imageActor.graphics.opacity = opacity;
         if (hasTint) {
            sprite.tint = tint;
         }
      }
   }
}