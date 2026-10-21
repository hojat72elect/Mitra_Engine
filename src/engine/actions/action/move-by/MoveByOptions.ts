import type {Vector} from "../../../math/Vector.ts";
import type {Easing} from "../../../math/easings.ts";

export interface MoveByOptions {
    offset: Vector;
    duration: number;
    easing?: Easing;
}