import type {MitraGraphicsContext} from "./MitraGraphicsContext";
import {UniformDictionary} from "./UniformDictionary";
import type {ImageSource} from "../ImageSource";
import {Shader} from "./Shader";

export interface ShaderOptions {
    /**
     * MitraGraphicsContextWebGL this layout will be attached to, these cannot be reused across webgl contexts.
     */
    graphicsContext: MitraGraphicsContext;

    /**
     * Optionally provide a name for the shader (useful for debugging purposes)
     */
    name?: string;

    /**
     * Vertex shader source code in glsl #version 300 es
     */
    vertexSource: string;

    /**
     * Fragment shader source code in glsl #version 300 es
     */
    fragmentSource: string;

    /**
     * Set initial uniforms
     */
    uniforms?: UniformDictionary;

    /**
     * Set initial images as uniform sampler2D
     */
    images?: Record<string, ImageSource>;

    /**
     * Optionally set the starting texture slot, default 0
     */
    startingTextureSlot?: number;

    /**
     * Callback to fire directly before linking the program
     */
    onPreLink?: (program: WebGLProgram) => void;
    /**
     * Callback to fire directly after the progam has finished compiling
     */
    onPostCompile?: (shader: Shader) => void;
}