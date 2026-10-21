import type {Vector} from "../../../math/Vector.ts";

export interface ScaleByOptions {
    /**
     * Absolute scale to change to
     */
    scaleOffset: Vector;
    /**
     * Duration to take in milliseconds
     */
    duration: number;
}