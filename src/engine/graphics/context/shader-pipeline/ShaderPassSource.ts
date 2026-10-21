import {Framebuffer} from "../Framebuffer";
import {ImageSource} from "../../ImageSource";

/**
 * Anything a {@apilink ShaderPass} can sample from: a {@apilink Framebuffer}, a loaded
 * {@apilink ImageSource}, or a raw premultiplied `WebGLTexture`
 */
export type ShaderPassSource = Framebuffer | ImageSource | WebGLTexture;
