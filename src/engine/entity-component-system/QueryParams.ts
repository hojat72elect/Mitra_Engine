import type {ComponentCtor} from "./ComponentCtor";
import type {Component} from "./Component";

export interface QueryParams<
    TKnownComponentCtors extends ComponentCtor<Component> = never,
    TAnyComponentCtors extends ComponentCtor<Component> = never
> {
    components?: {
        all?: TKnownComponentCtors[];
        any?: TAnyComponentCtors[];
        not?: ComponentCtor<Component>[];
    };
    tags?: {
        all?: string[];
        any?: string[];
        not?: string[];
    };
}