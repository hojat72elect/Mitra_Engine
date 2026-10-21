import {Scene, type SceneConstructor} from "../scene";
import type {SceneWithOptions} from "./SceneWithOptions";

export type SceneMap<TKnownScenes extends string = any> = Record<TKnownScenes, Scene | SceneConstructor | SceneWithOptions>;
