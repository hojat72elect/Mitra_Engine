/**
 * Represents duration stats for a frame
 */
export interface FrameDurationStats {
    /**
     * Gets the frame's total time to run the update function (in ms)
     */
    update: number;

    /**
     * Gets the frame's total time to run the draw function (in ms)
     */
    draw: number;

    /**
     * Gets the frame's total render duration (update + draw duration) (in ms)
     */
    total: number;
}
