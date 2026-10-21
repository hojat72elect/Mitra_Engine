import type {PhysicsStatistics} from "./PhysicsStatistics";
import type {GraphicsStatistics} from "./GraphicsStatistics";
import type {FrameDurationStats} from "./FrameDurationStats";
import type {FrameActorStats} from "./FrameActorStats";

/**
 * Represents a frame's individual statistics
 */
export interface FrameStatistics {
    /**
     * The number of the frame
     */
    id: number;

    /**
     * Gets the frame's delta (time since last frame scaled by {@apilink Engine.timescale}) (in ms)
     *
     * Mitra extension depends on this
     */
    elapsedMs: number;

    /**
     * Gets the frame's frames-per-second (FPS)
     */
    fps: number;

    /**
     * Duration statistics (in ms)
     */
    duration: FrameDurationStats;

    /**
     * Duration statistics (in ms) for ECS systems
     */
    systemDuration: Record<string, number>;

    /**
     * Actor statistics
     */
    actors: FrameActorStats;

    /**
     * Physics statistics
     */
    physics: PhysicsStatistics;

    /**
     * Graphics statistics
     */
    graphics: GraphicsStatistics;
}