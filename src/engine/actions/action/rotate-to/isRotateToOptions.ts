import type {RotateToOptions} from "./RotateToOptions.ts";

export function isRotateToOptions(x: any): x is RotateToOptions {
    return typeof x.angle === 'number' && typeof x.duration === 'number';
}