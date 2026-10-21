import type {Vector} from "../../../math/Vector.ts";

export interface CurveByOptions {
    /**
     * Bezier Curve relative to the current actor position to move
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
     * For bigger 'uniform' curves you may want to increase quality to make the motion appear smooth
     *
     * Default 4
     */
    quality?: number;
}
