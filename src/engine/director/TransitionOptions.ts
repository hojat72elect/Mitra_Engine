import type {Easing} from "../math";

export interface TransitionOptions {
    /**
     * Transition duration in milliseconds
     */
    duration: number;

    /**
     * Optionally hides the loader during the transition
     *
     * If either the out or in transition have this set to true, then the loader will be hidden.
     *
     * Default false
     */
    hideLoader?: boolean;

    /**
     * Optionally blocks user input during a transition
     *
     * Default false
     */
    blockInput?: boolean;

    /**
     * Optionally specify a easing function, by default linear
     */
    easing?: Easing;
    /**
     * Optionally specify a transition direction, by default 'out'
     *
     * * For 'in' direction transitions start at 1 and complete is at 0
     * * For 'out' direction transitions start at 0 and complete is at 1
     */
    direction?: 'out' | 'in';
}