import {Component} from "../../engine";
import {PluginObject} from "./objects";

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