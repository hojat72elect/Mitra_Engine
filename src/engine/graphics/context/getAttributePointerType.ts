
/**
 * Based on the attribute return the corresponding supported attrib pointer type
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
 * @param gl
 * @param type
 */
export function getAttributePointerType(gl: WebGL2RenderingContext, type: number) {
    switch (type) {
        case gl.LOW_FLOAT:
        case gl.HIGH_FLOAT:
        case gl.FLOAT:
        case gl.FLOAT_VEC2:
        case gl.FLOAT_VEC3:
        case gl.FLOAT_VEC4:
            return gl.FLOAT;
        case gl.INT:
        case gl.INT_VEC2:
        case gl.INT_VEC3:
        case gl.INT_VEC4:
        case gl.BOOL:
        case gl.BOOL_VEC2:
        case gl.BOOL_VEC3:
        case gl.BOOL_VEC4:
            return gl.INT;
        case gl.UNSIGNED_INT:
        case gl.UNSIGNED_INT_VEC2:
        case gl.UNSIGNED_INT_VEC3:
        case gl.UNSIGNED_INT_VEC4:
            return gl.UNSIGNED_INT;
        case gl.BYTE:
            return gl.BYTE;
        case gl.UNSIGNED_BYTE:
            return gl.UNSIGNED_BYTE;
        case gl.SHORT:
            return gl.SHORT;
        case gl.UNSIGNED_SHORT:
            return gl.UNSIGNED_SHORT;
        default:
            return gl.FLOAT;
    }
}
