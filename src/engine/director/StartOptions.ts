import type {Transition} from "./Transition";
import {DefaultLoader} from "./DefaultLoader";
import type {LoaderConstructor} from "./LoaderConstructor";

export interface StartOptions {
    /**
     * Optionally provide first transition from the game start screen
     */
    inTransition?: Transition;
    /**
     * Optionally provide a main loader to run before the game starts
     */
    loader?: DefaultLoader | LoaderConstructor;
}