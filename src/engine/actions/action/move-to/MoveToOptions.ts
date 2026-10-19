import {type Easing, Vector} from "../../../math";

export interface MoveToOptions {
    pos: Vector;
    duration: number;
    easing?: Easing;
}