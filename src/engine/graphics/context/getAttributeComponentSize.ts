/**
 * Based on the type return the number of attribute components
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
 * @param gl
 * @param type
 */
export function getAttributeComponentSize(gl: WebGL2RenderingContext, type: number): number {
    switch (type) {
        case gl.LOW_FLOAT:
        case gl.HIGH_FLOAT:
        case gl.FLOAT:
            return 1;
        case gl.FLOAT_VEC2:
            return 2;
        case gl.FLOAT_VEC3:
            return 3;
        case gl.FLOAT_VEC4:
            return 4;
        case gl.INT:
        case gl.UNSIGNED_INT:
        case gl.BOOL:
        case gl.BYTE:
        case gl.UNSIGNED_BYTE:
        case gl.UNSIGNED_SHORT:
        case gl.SHORT:
            return 1;
        case gl.INT_VEC2:
        case gl.UNSIGNED_INT_VEC2:
        case gl.BOOL_VEC2:
            return 2;
        case gl.INT_VEC3:
        case gl.UNSIGNED_INT_VEC3:
        case gl.BOOL_VEC3:
            return 3;
        case gl.INT_VEC4:
        case gl.UNSIGNED_INT_VEC4:
        case gl.BOOL_VEC4:
            return 4;
        default:
            return 1;
    }
}
