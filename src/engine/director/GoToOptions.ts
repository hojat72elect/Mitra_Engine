import type {Transition} from "./Transition";
import {DefaultLoader} from "./DefaultLoader";

/**
 * Provide scene activation data and override any existing configured route transitions or loaders
 */
export interface GoToOptions<TActivationData = any> {
    /**
     * Optionally supply scene activation data passed to Scene.onActivate
     */
    sceneActivationData?: TActivationData;
    /**
     * Optionally supply destination scene "in" transition, this will override any previously defined transition
     */
    destinationIn?: Transition;
    /**
     * Optionally supply source scene "out" transition, this will override any previously defined transition
     */
    sourceOut?: Transition;
    /**
     * Optionally supply a different loader for the destination scene, this will override any previously defined loader
     */
    loader?: DefaultLoader;
}
