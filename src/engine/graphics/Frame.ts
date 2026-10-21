import {Graphic} from "./Graphic";

/**
 * Frame of animation
 */
export interface Frame {
    /**
     * Optionally specify a graphic to show, no graphic shows an empty frame
     */
    graphic?: Graphic;
    /**
     * Optionally specify the number of ms the frame should be visible, overrides the animation duration (default 100 ms)
     */
    duration?: number;
}
