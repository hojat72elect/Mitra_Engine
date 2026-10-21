import {Vector} from "../../../math";
import type {MoveByOptions} from "./MoveByOptions.ts";

export function isMoveByOptions(x: any): x is MoveByOptions {
    return x.offset instanceof Vector && typeof x.duration === 'number';
}
