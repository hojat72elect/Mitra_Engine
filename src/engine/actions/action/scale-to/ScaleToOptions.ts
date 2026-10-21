import type {Vector} from "../../../math/Vector.ts";

export interface ScaleToOptions {
    /**
     * Absolute scale to change to
     */
    scale: Vector;
    /**
     * Duration to take in milliseconds
     */
    duration: number;
}