import {Color} from "../../color";
import type {Vector} from "../../math/Vector.ts";
import type {Vector3} from "../../math/Vector3.ts";
import type {Vector4} from "../../math/Vector4.ts";
import type {AffineMatrix} from "../../math/AffineMatrix.ts";
import type {Matrix} from "../../math/Matrix.ts";

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