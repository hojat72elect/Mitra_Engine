import {Vector} from "../../../math";
import {MoveByOptions} from "./MoveByOptions";

export function isMoveByOptions(x: any): x is MoveByOptions {
    return x.offset instanceof Vector && typeof x.duration === 'number';
}
