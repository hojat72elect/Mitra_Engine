import type {RotateByOptions} from "./RotateByOptions.ts";

export function isRotateByOptions(x: any): x is RotateByOptions {
    return typeof x.angleRadiansOffset === 'number' && typeof x.duration === 'number';
}