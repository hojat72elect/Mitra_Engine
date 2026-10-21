export interface VertexAttributeDefinition {
    /**
     * string name of the attribute in the shader program, commonly `a_nameofmyvariable`
     */
    name: string;
    /**
     * Number of components for a given attribute
     * Must be 1, 2, 3, or 4
     *
     * For example a vec4 attribute would be `4` floats, so 4
     */
    size: number;
    /**
     * Supported types in webgl 1
     * * gl.BYTE
     * * gl.SHORT
     * * gl.UNSIGNED_BYTE
     * * gl.UNSIGNED_SHORT
     * * gl.FLOAT
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
     */
    glType: number;
    /**
     * Is the attribute normalized between (0-1)
     */
    normalized: boolean;
    /**
     * Location index in the shader program
     */
    location: number;
}