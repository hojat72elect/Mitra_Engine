import type {Loadable} from "../interfaces/Loadable";

export interface DefaultLoaderOptions {
    /**
     * List of loadables
     */
    loadables?: Loadable<any>[];
}
