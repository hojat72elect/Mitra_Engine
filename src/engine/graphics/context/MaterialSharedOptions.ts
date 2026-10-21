import type {MitraGraphicsContext} from "./MitraGraphicsContext";
import {Color} from "../../color";
import {ImageSource} from "../ImageSource";
import type {UniformDictionary} from "./UniformDictionary";


export type MaterialSharedOptions = {
    /**
     * Name the material for debugging
     */
    name?: string;

    /**
     * Mitra graphics context to create the material (only WebGL is supported at the moment)
     */
    graphicsContext?: MitraGraphicsContext;

    /**
     * Optionally specify a vertex shader
     *
     * If none supplied the default will be used
     *
     * ```
     *  #version 300 es
     *  // vertex position in local space
     *  in vec2 a_position;
     *  in vec2 a_uv;
     *  out vec2 v_uv;
     *  // orthographic projection matrix
     *  uniform mat4 u_matrix;
     *  // world space transform matrix
     *  uniform mat4 u_transform;
     *  void main() {
     *    // Set the vertex position using the ortho & transform matrix
     *    gl_Position = u_matrix * u_transform * vec4(a_position, 0.0, 1.0);
     *    // Pass through the UV coord to the fragment shader
     *    v_uv = a_uv;
     *  }
     * ```
     */
    vertexSource?: string;

    /**
     * Add custom color, by default ex.Color.Transparent
     */
    color?: Color;

    /**
     * Add additional images to the material, you are limited by the GPU's maximum texture slots
     *
     * Specify a dictionary of uniform sampler names to ImageSource, they are also bound as named
     * sources in every pass when `passes` is provided
     */
    images?: Record<string, ImageSource>;

    /**
     * Optionally set starting uniforms on a shader, they are also forwarded to every pass when
     * `passes` is provided
     */
    uniforms?: UniformDictionary;
};
