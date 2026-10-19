/**
 * Represents actor stats for a frame
 */
export interface FrameActorStats {
    /**
     * Gets the frame's number of actors (alive)
     */
    alive: number;

    /**
     * Gets the frame's number of actors (killed)
     */
    killed: number;

    /**
     * Gets the frame's number of remaining actors (alive - killed)
     */
    remaining: number;

    /**
     * Gets the frame's number of UI actors
     */
    ui: number;

    /**
     * Gets the frame's number of total actors (remaining + UI)
     */
    total: number;
}
