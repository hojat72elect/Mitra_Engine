import {Scene, type SceneConstructor} from "../scene";
import type {Transition} from "./Transition";
import {DefaultLoader} from "./DefaultLoader";
import {LoaderConstructor} from "./LoaderConstructor";

export interface SceneWithOptions {
    /**
     * Scene associated with this route
     *
     * If a constructor is provided it will not be constructed until navigation is requested
     */
    scene: Scene | SceneConstructor;
    /**
     * Specify scene transitions
     */
    transitions?: {
        /**
         * Optionally specify a transition when going "in" to this scene
         */
        in?: Transition;
        /**
         * Optionally specify a transition when going "out" of this scene
         */
        out?: Transition;
    };
    /**
     * Optionally specify a loader for the scene
     */
    loader?: DefaultLoader | LoaderConstructor;
}