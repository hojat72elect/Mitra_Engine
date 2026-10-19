import {type Easing, Vector} from "../../../math";

export interface MoveByOptions {
    offset: Vector;
    duration: number;
    easing?: Easing;
}