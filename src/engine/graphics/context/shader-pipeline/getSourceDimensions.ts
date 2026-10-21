import {MitraGraphicsContextWebgl} from "../MitraGraphicsContextWebgl";
import type {ShaderPassSource} from "./ShaderPassSource";
import {Framebuffer} from "../Framebuffer";
import {ImageSource} from "../../ImageSource";

/**
 * Pixel dimensions of a {@apilink ShaderPassSource}, falling back to the canvas drawing buffer
 * for raw `WebGLTexture`s which have no queryable dimensions
 */
export function getSourceDimensions(
    graphicsContext: MitraGraphicsContextWebgl,
    source: ShaderPassSource
): [width: number, height: number] {
    if (source instanceof Framebuffer) {
        return [source.width, source.height];
    }
    if (source instanceof ImageSource) {
        return [source.width, source.height];
    }
    const gl = graphicsContext.__gl;
    return [gl.drawingBufferWidth, gl.drawingBufferHeight];
}
