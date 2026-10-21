import type {ImageSource} from "./ImageSource";

export interface SpriteOptions {
    /**
     * Image to create a sprite from
     */
    image: ImageSource;
    /**
     * By default the source is the entire dimension of the {@apilink ImageSource}
     */
    sourceView?: { x: number; y: number; width: number; height: number };
    /**
     * By default the size of the final sprite is the size of the {@apilink ImageSource}
     */
    destSize?: { width: number; height: number };
}