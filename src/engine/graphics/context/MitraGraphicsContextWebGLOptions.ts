import type {MitraGraphicsContextOptions} from "./MitraGraphicsContext";
import type {GarbageCollector} from "../../garbage-collector";

export interface MitraGraphicsContextWebGLOptions extends MitraGraphicsContextOptions {
    context?: WebGL2RenderingContext;
    garbageCollector?: { garbageCollector: GarbageCollector; collectionInterval: number };
    handleContextLost?: (e: Event) => void;
    handleContextRestored?: (e: Event) => void;
}