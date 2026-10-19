import {FrameStats} from "./FrameStats";

/**
 * Debug stats containing current and previous frame statistics
 */
export interface DebugStats {
    currFrame: FrameStats;
    prevFrame: FrameStats;
}