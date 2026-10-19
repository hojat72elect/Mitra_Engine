import {LoaderConstructor} from "./LoaderConstructor";

/**
 * Returns true if the constructor is for a Mitra Loader.
 */
export function isLoaderConstructor(x: any): x is LoaderConstructor {
    return !!x?.prototype && !!x?.prototype?.constructor?.name;
}