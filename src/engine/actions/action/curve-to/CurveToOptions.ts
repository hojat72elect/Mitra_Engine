import type {Vector} from "../../../math/Vector.ts";

export interface CurveToOptions {
    /**
     * Bezier Curve in world coordinates to animate towards
     *
     * The start control point is assumed to be the actor's current position
     */
    controlPoints: [control1: Vector, control2: Vector, end: Vector];
    /**
     * Total duration for the action to run
     */
    duration: number;
    /**
     * Dynamic mode will speed up/slow down depending on the curve
     *
     * Uniform mode will animate at a consistent velocity across the curve
     *
     * Default: 'dynamic'
     */
    mode?: 'dynamic' | 'uniform';
    /**
     * Quality when sampling uniform points on the curve. Samples = 4 * quality;
     *
     * For bigger 'uniform' curves you may want to increase quality
     *
     * Default 4
     */
    quality?: number;
}