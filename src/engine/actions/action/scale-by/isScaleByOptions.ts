import type {ScaleByOptions} from "./ScaleByOptions";

export function isScaleByOptions(x: any): x is ScaleByOptions {
    return typeof x.scaleOffset === 'object' && typeof x.duration === 'number';
}