import {Vector} from "../../../math";
import {MoveToOptions} from "./MoveToOptions";

export function isMoveToOptions(x: any): x is MoveToOptions {
    return x.pos instanceof Vector && typeof x.duration === 'number';
}