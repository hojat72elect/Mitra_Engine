import type {ShaderPassSource} from "./ShaderPassSource";
import type {ShaderPassDestination} from "./ShaderPassDestination";
import type {ShaderPipelineProcessOptions} from "./ShaderPipelineProcessOptions";
import {Shader} from "../Shader";

/**
 * Anything that can transform a source into a destination through one or more shader passes.
 *
 * {@apilink ShaderPipeline} is the built-in linear implementation; implement this directly for
 * non-linear pass graphs (for example bloom's downsample/upsample ladder) and plug it into a
 * {@apilink Material} or {@apilink ShaderPipelinePostProcessor} the same way.
 */
export interface ShaderPipelineLike {
    process(source: ShaderPassSource, destination: ShaderPassDestination, options?: ShaderPipelineProcessOptions): void;

    dispose?(): void;

    /**
     * Every compiled {@apilink Shader} this pipeline drives, in pass order. Optional — a pass graph
     * that can't enumerate its own passes may omit this; {@apilink Material.update} falls back to
     * just the composite shader when it's missing.
     */
    getShaders?(): Shader[];
}
