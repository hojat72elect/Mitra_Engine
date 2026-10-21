import {Framebuffer} from "./Framebuffer";
import type {FramebufferOptions} from "./FramebufferOptions";

export interface MultisampleFramebufferOptions extends FramebufferOptions {
    /**
     * Optionally specify number of anti-aliasing samples to use, by default the max for the platform
     */
    samples?: number;
}

/**
 * A {@apilink Framebuffer} backed by a multisampled renderbuffer.
 *
 * Drawing goes into the MSAA renderbuffer ({@apilink Framebuffer.glFramebuffer}); reading
 * {@apilink Framebuffer.texture} (or blitting/copying) resolves the samples into the backing
 * color texture first, so consumers never need to sequence the resolve themselves.
 */
export class MultisampleFramebuffer extends Framebuffer {
    public readonly samples: number;
    private _renderBuffer!: WebGLRenderbuffer;
    private _renderFrameBuffer!: WebGLFramebuffer;
    private _msaaDisposed = false;

    constructor(options: MultisampleFramebufferOptions) {
        super(options);
        const gl = this._gl;
        this.samples = Math.min(options.samples ?? gl.getParameter(gl.MAX_SAMPLES), gl.getParameter(gl.MAX_SAMPLES));

        this._renderBuffer = gl.createRenderbuffer()!;
        this._renderFrameBuffer = gl.createFramebuffer()!;
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.samples, this.bufferFormat, this.width, this.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._renderFrameBuffer);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this._renderBuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    public override get glFramebuffer(): WebGLFramebuffer {
        return this._renderFrameBuffer;
    }

    public override get texture(): WebGLTexture {
        this._resolve();
        return super.texture;
    }

    public override resize(width: number, height: number): void {
        if (width === this.width && height === this.height) {
            return;
        }
        super.resize(width, height);
        const gl = this._gl;
        gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.samples, this.bufferFormat, width, height);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    public override blitToScreen(): void {
        // blit the multisampled renderbuffer straight to the canvas, resolving in a single blit
        const gl = this._gl;
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._renderFrameBuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 1.0, 1.0]);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.LINEAR);
    }

    public override dispose(): void {
        if (!this._msaaDisposed) {
            this._msaaDisposed = true;
            const gl = this._gl;
            gl.deleteFramebuffer(this._renderFrameBuffer);
            gl.deleteRenderbuffer(this._renderBuffer);
            super.dispose();
        }
    }

    protected override _resolve(): WebGLFramebuffer {
        const gl = this._gl;
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._renderFrameBuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._textureFramebuffer);
        gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 1.0, 1.0]);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.LINEAR);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        return this._textureFramebuffer;
    }
}
