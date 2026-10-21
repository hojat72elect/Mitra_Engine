import type {RotationType} from "../../../math/RotationType.ts";

export interface RotateToOptions {
    /**
     * Absolute angle to rotate to in radians
     */
    angle: number;
    /**
     * Duration to take in milliseconds
     */
    duration: number;
    /**
     * Optionally provide type of rotation, default is RotationType.ShortestPath
     */
    rotationType?: RotationType;
}