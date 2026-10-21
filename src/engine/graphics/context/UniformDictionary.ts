import {AffineMatrix, Matrix, Vector, Vector3, Vector4} from "../../math";
import {Color} from "../../color";

export type UniformDictionary = Record<
    string,
    | number
    | boolean
    | Vector
    | Vector3
    | Vector4
    | Color
    | AffineMatrix
    | Matrix
    | Float32Array
    | [uniformData: Float32Array, bindingPoint: number]
>;