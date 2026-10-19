import {ComponentCtor} from "./ComponentCtor";
import {Component} from "./Component";

export function isComponentCtor(value: any): value is ComponentCtor<Component> {
    return !!value && !!value.prototype && !!value.prototype.constructor;
}
