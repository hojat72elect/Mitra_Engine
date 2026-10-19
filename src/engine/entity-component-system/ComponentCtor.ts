import {Component} from "./Component";

/**
 * Component Constructor Types
 */
export declare type ComponentCtor<TComponent extends Component = Component> = new (...args: any[]) => TComponent;
