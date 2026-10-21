import type {MitraGraphicsContextWebgl} from '../MitraGraphicsContextWebgl';
import {Framebuffer} from '../Framebuffer';
import type {Shader} from '../Shader';
import type {ShaderPassDestination} from './ShaderPassDestination';
import {ShaderPass} from './ShaderPass';
import {ShaderPassSource} from "./ShaderPassSource";
import {getSourceDimensions} from "./getSourceDimensions";
import {ShaderPipelineProcessOptions} from "./ShaderPipelineProcessOptions";
import {mergePassSources} from "./mergePassSources";
import {ShaderPipelineLike} from "./ShaderPipelineLike";
import {ShaderPassLike} from "./ShaderPassLike";

interface ShaderPipelineOptions {
    graphicsContext: MitraGraphicsContextWebgl;
    /**
     * Name the pipeline for debugging
     */
    name?: string;
    /**
     * Ordered passes, each one reads the previous pass's output as `u_image` (`u_graphic` is
     * accepted as a synonym; the pipeline source for the first pass) and can read the original
     * pipeline source as `u_original`
     */
    passes: ShaderPassLike[];
}

/**
 * Runs an ordered chain of {@apilink ShaderPass}es:
 * `source → pass0 → fb0 → pass1 → fb1 → ... → destination`
 *
 * Intermediate framebuffers are allocated lazily, one per pass, sized by each pass's `scale`
 * relative to the source. The final pass renders into the caller's destination at the
 * destination's own size, which is what upsamples a downscaled chain back up.
 */
export class ShaderPipeline implements ShaderPipelineLike {
    public readonly name: string;
    public readonly passes: ShaderPass[];
    private _graphicsContext: MitraGraphicsContextWebgl;
    private _intermediates: (Framebuffer | undefined)[];
    private _disposed = false;

    constructor(options: ShaderPipelineOptions) {
        const {graphicsContext, name, passes} = options;
        if (!passes || passes.length < 1) {
            throw new Error(`ShaderPipeline "${name ?? 'anonymous'}" must be provided at least 1 pass`);
        }
        this._graphicsContext = graphicsContext;
        this.name = name ?? 'anonymous pipeline';
        this.passes = passes.map((pass, index) =>
            typeof pass === 'string' ? new ShaderPass({
                graphicsContext,
                name: `${this.name} pass ${index}`,
                fragmentSource: pass
            }) : pass
        );
        this._intermediates = new Array(this.passes.length).fill(undefined);
    }

    /**
     * Runs every pass in order, rendering the final pass into `destination`
     */
    public process(source: ShaderPassSource, destination: ShaderPassDestination, options?: ShaderPipelineProcessOptions): void {
        if (this._disposed) {
            throw new Error(`ShaderPipeline "${this.name}" has been disposed and cannot be used. Create a new pipeline instance.`);
        }
        const [sourceWidth, sourceHeight] = getSourceDimensions(this._graphicsContext, source);
        const elapsed = options?.elapsed;
        const uniforms = options?.uniforms;
        const extraSources = options?.sources;

        let previous: ShaderPassSource = source;
        for (let i = 0; i < this.passes.length; i++) {
            const pass = this.passes[i];
            const isLast = i === this.passes.length - 1;

            let target: ShaderPassDestination;
            if (isLast) {
                target = destination;
            } else {
                const width = Math.max(1, Math.ceil(sourceWidth * pass.scale));
                const height = Math.max(1, Math.ceil(sourceHeight * pass.scale));
                let intermediate = this._intermediates[i];
                if (!intermediate) {
                    intermediate = this._intermediates[i] = new Framebuffer({
                        graphicsContext: this._graphicsContext,
                        width,
                        height,
                        filtering: pass.filtering
                    });
                } else {
                    intermediate.resize(width, height);
                }
                target = intermediate;
            }

            pass.draw({
                sources: mergePassSources({u_image: previous, u_graphic: previous, u_original: source}, extraSources),
                destination: target,
                uniforms,
                elapsed
            });

            previous = target ?? previous;
        }
    }

    /**
     * Every pass's compiled {@apilink Shader}, in pass order
     */
    public getShaders(): Shader[] {
        return this.passes.map((pass) => pass.getShader());
    }

    /**
     * Disposes the passes and intermediate framebuffers, the pipeline cannot be used afterwards
     */
    public dispose(): void {
        if (!this._disposed) {
            this._disposed = true;
            for (const pass of this.passes) {
                pass.dispose();
            }
            for (const intermediate of this._intermediates) {
                intermediate?.dispose();
            }
            this._intermediates.length = 0;
        }
    }
}
