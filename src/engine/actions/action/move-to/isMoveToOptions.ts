import {Vector} from "../../../math";
import type {MoveToOptions} from "./MoveToOptions.ts";

export function isMoveToOptions(x: any): x is MoveToOptions {
    return x.pos instanceof Vector && typeof x.duration === 'number';
}