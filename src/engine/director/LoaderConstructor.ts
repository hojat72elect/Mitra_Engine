import {DefaultLoader} from "./DefaultLoader";

export type LoaderConstructor = new (...args: any[]) => DefaultLoader;