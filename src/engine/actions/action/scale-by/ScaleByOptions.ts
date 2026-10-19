import {Vector} from "../../../math";

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