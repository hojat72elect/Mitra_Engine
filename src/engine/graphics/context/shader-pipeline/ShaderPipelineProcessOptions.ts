import type {ShaderPassSource} from "./ShaderPassSource";
import type {UniformDictionary} from "../UniformDictionary";

export interface ShaderPipelineProcessOptions {
    /**
     * Elapsed milliseconds forwarded to each pass's `u_elapsed_ms`
     */
    elapsed?: number;
    /**
     * Uniform values forwarded to every pass, merged over each pass's own uniforms.
     *
     * Materials use this to flow their custom uniforms and built-ins into the pipeline.
     */
    uniforms?: UniformDictionary;
    /**
     * Additional named sources bound to every pass after its own (`u_image`, `u_graphic`, `u_original`, ...),
     * each record key is bound as the sampler uniform of that name.
     *
     * Materials use this to flow their `images` into the pipeline. Reserved pass source names
     * cannot be overridden.
     */
    sources?: Record<string, ShaderPassSource>;
}
