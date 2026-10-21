import {TiledTileLayer} from "../parser/TiledParser.ts";
import {Component} from "../../engine/entity-component-system/Component.ts";

export interface TiledLayerDataComponentOptions {
    tiledTileLayer: TiledTileLayer;
}

export class TiledLayerDataComponent extends Component {
    public readonly tiledTileLayer: TiledTileLayer;

    constructor(options: TiledLayerDataComponentOptions) {
        super();
        const {tiledTileLayer} = options;
        this.tiledTileLayer = tiledTileLayer;
    }
}