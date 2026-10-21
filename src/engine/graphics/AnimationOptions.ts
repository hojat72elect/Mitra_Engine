import type {Frame} from "./Frame";
import {AnimationStrategy} from "./AnimationStrategy";

/**
 * Animation options for building an animation via constructor.
 */
export interface AnimationOptions {
    /**
     * List of frames in the order you wish to play them
     */
    frames: Frame[];
    /**
     * Optionally set a positive speed multiplier on the animation.
     *
     * By default 1, meaning 1x speed. If set to 2, it will play the animation twice as fast.
     */
    speed?: number;
    /**
     * Optionally reverse the direction of play
     */
    reverse?: boolean;
    /**
     * Optionally specify a default frame duration in ms (Default is 100)
     */
    frameDuration?: number;
    /**
     * Optionally specify a total duration of the animation in ms to calculate each frame's duration
     */
    totalDuration?: number;
    /**
     * Optionally specify the {@apilink AnimationStrategy} for the Animation
     */
    strategy?: AnimationStrategy;
    /**
     * Optionally set arbitrary meta data for the animation
     */
    data?: Record<string, any>;
    /**
     * Optionally tick this animation even when offscreen, default false. Useful for keeping animations synchronized
     * across your game scene.
     */
    shouldAlwaysTick?: boolean;
}
