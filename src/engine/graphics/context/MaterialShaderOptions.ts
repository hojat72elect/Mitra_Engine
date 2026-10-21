import {ShaderPassLike} from "./shader-pipeline/ShaderPassLike";
import {ShaderPipelineLike} from "./shader-pipeline/ShaderPipelineLike";

export type MaterialShaderOptions =
    | // single pass custom shading
    {
        /**
         * The fragment shader applied when the graphic is drawn on screen
         *
         * *Note: Mitra image alpha's are pre-multiplied
         *
         * Pre-built varyings:
         *
         * * `in vec2 v_uv` - UV coordinate
         * * `in vec2 v_screenuv` - UV coordinate
         *
         * Pre-built uniforms:
         *
         * * `uniform sampler2D u_graphic` - The current graphic displayed by the GraphicsComponent
         * * `uniform sampler2D u_image` - Synonym for `u_graphic`
         * * `uniform sampler2D u_original` - The pre-effect graphic; equal to `u_graphic`/`u_image` when there is no pipeline
         * * `uniform sampler2D u_screen_texture` - The screen texture, bound when referenced in the source
         * * `uniform vec2 u_resolution` - The current resolution of the screen (in pixels)
         * * `uniform vec2 u_graphic_resolution` - The current resolution of the graphic (in pixels)
         * * `uniform vec2 u_size;` - The current size of the graphic (in pixels)
         * * `uniform vec4 u_color` - The current color of the material
         * * `uniform float u_opacity` - The current opacity of the graphics context
         * * `uniform float u_time_ms` - The current time in milliseconds
         * * `uniform mat4 u_matrix` - The orthographic projection matrix
         * * `uniform mat4 u_transform` - The current geometry transform matrix
         */
        fragmentSource: string;

        passes?: undefined;
        padding?: undefined;
    }
    // multi-pass pipeline
    | {
    /**
     * Multi-pass pipeline run on the graphic's texture offscreen before it is drawn.
     *
     * Provide an ordered list of passes (bare fragment strings or {@apilink ShaderPass}), or any
     * {@apilink ShaderPipelineLike} implementation ({@apilink BloomEffect}, {@apilink GlowEffect},
     * {@apilink BlurEffect}, or your own pass graph).
     *
     * The material's `uniforms`, `images`, and built-ins (`u_opacity`, `u_color`,
     * `u_graphic_resolution`, `u_size`) are forwarded to every pass.
     */
    passes: ShaderPassLike[] | ShaderPipelineLike;

    /**
     * The **final composite** fragment shader: it draws the pipeline's output (bound as
     * `u_graphic`, with `u_image` as a synonym) on screen and is where screen-space work like
     * `u_screen_texture` belongs. The pre-effect graphic is also available as `u_original`, so
     * the composite can mix the processed result with the untouched source.
     *
     * When omitted a passthrough composite is used that draws the pipeline output with the
     * context opacity applied.
     */
    fragmentSource?: string;

    /**
     * Extra transparent pixels (in source-texture pixels) added around the graphic when running
     * `passes`, so effects like blur/glow are not clipped to the graphic's quad. The on-screen
     * quad expands to match. Default 0.
     */
    padding?: number;
};
