import type {MoveByOptions} from "./MoveByOptions.ts";
import {Vector} from "../../../math/Vector.ts";

export function isMoveByOptions(x: any): x is MoveByOptions {
    return x.offset instanceof Vector && typeof x.duration === 'number';
}
