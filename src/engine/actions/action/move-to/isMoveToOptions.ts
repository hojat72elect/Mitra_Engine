import type {MoveToOptions} from "./MoveToOptions.ts";
import {Vector} from "../../../math/Vector.ts";

export function isMoveToOptions(x: any): x is MoveToOptions {
    return x.pos instanceof Vector && typeof x.duration === 'number';
}