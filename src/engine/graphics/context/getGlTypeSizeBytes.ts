/**
 * Return the size of the GlType in bytes
 * @param gl
 * @param type
 */
export function getGlTypeSizeBytes(gl: WebGLRenderingContext, type: number): number {
    switch (type) {
        case gl.INT:
        case gl.UNSIGNED_INT:
        case gl.FLOAT:
            return 4;
        case gl.SHORT:
            return 2;
        case gl.UNSIGNED_SHORT:
            return 2;
        case gl.BYTE:
            return 1;
        case gl.UNSIGNED_BYTE:
            return 1;
        default:
            return 1;
    }
}
