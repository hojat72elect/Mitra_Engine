import {ScaleToOptions} from "./ScaleToOptions";

export function isScaleToOptions(x: any): x is ScaleToOptions {
    return typeof x.scale === 'object' && typeof x.duration === 'number';
}