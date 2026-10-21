import type {Collider} from "./Collider";
import {vec, type Vector} from "../../math/Vector.ts";
import {LineSegment} from "../../math/LineSegment.ts";

/**
 * Specific information about a contact and it's separation
 */
export class SeparationInfo {
    /**
     * Collider A
     */
    collider!: Collider;

    /**
     * Signed value (negative means overlap, positive no overlap)
     */
    separation!: number;

    /**
     * Axis of separation from the collider's perspective
     */
    axis: Vector = vec(0, 0);

    /**
     * Local axis of separation from the collider's perspective
     */
    localAxis?: Vector = vec(0, 0);

    /**
     * Side of separation (reference) from the collider's perspective
     */

    side?: LineSegment = new LineSegment(vec(0, 0), vec(0, 0));

    /**
     * Local side of separation (reference) from the collider's perspective
     */
    localSide?: LineSegment = new LineSegment(vec(0, 0), vec(0, 0));

    /**
     * Index of the separation side (reference) from the collider's perspective
     */
    sideId?: number;

    /**
     * Point on collider B (incident point)
     */
    point: Vector = vec(0, 0);

    /**
     * Local point on collider B (incident point)
     */
    localPoint?: Vector = vec(0, 0);
}