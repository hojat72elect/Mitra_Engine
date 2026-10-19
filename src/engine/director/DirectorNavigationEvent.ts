import {Scene} from "../scene";

export interface DirectorNavigationEvent {
    sourceName: string;
    sourceScene: Scene;
    destinationName: string;
    destinationScene: Scene;
}
