import type {RotationType} from "../../../math/RotationType.ts";

export interface RotateByOptions {
    /**
     * Angle in radians to offset from the current and rotate
     */
    angleRadiansOffset: number;
    /**
     * Duration to take in milliseconds
     */
    duration: number;
    /**
     * Optionally provide type of rotation. When omitted the entity rotates by exactly the
     * signed offset provided, preserving full turns (an offset of 2 PI performs a full revolution).
     * When provided, the offset determines the target orientation and the rotation type picks
     * the travel path to it. Non-zero full-turn multiples of 2 PI travel one full revolution in
     * the requested direction for Clockwise, CounterClockwise, and LongestPath, while
     * ShortestPath will not move.
     */
    rotationType?: RotationType;
}