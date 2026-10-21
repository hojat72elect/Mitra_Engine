import {PluginObject} from "./objects";
import {Component} from "../../engine/entity-component-system/Component.ts";

export interface TiledDataComponentOptions {
    tiledObject: PluginObject;
}

export class TiledDataComponent extends Component {
    public tiledObject: PluginObject;

    constructor(options: TiledDataComponentOptions) {
        super();
        const {tiledObject} = options;
        this.tiledObject = tiledObject;
    }
}