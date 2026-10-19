import {Vector} from "../../../math";

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