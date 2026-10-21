/**
 * Attempt to discern the glType of an attribute from vertex source
 * @param gl
 * @param source
 * @param variable
 */
export function getGLTypeFromSource(gl: WebGLRenderingContext, source: string, variable: string) {
    const attributeRegexTemplate = `(?<type>[a-z0-9]+)\\s+${variable};`;
    const regex = new RegExp(attributeRegexTemplate, 'g');
    const matches = regex.exec(source);
    const type = matches?.groups?.type;

    switch (type) {
        case 'float':
        case 'vec2':
        case 'vec3':
        case 'vec4':
            return gl.FLOAT;
        case 'int':
        case 'ivec2':
        case 'ivec3':
        case 'ivec4':
            return gl.INT;
        case 'uint':
        case 'uvec2':
        case 'uvec3':
        case 'uvec4':
            return gl.UNSIGNED_INT;
        case 'bool':
        case 'bvec2':
        case 'bvec3':
        case 'bvec4':
            return gl.BOOL;
        case 'short':
            return gl.SHORT;
        case 'ushort':
            return gl.UNSIGNED_SHORT;
        case 'ubyte':
            return gl.UNSIGNED_BYTE;
        case 'byte':
            return gl.BYTE;
        default:
            return gl.FLOAT;
    }
}
