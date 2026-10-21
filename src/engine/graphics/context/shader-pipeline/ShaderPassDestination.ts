import {Framebuffer} from "../Framebuffer";

/**
 * Where a {@apilink ShaderPass} renders to: a {@apilink Framebuffer}, or `null` for the canvas backbuffer.
 *
 * Inside an engine frame use {@apilink MitraGraphicsContextWebGL.drawTarget} to composite into the frame.
 */
export type ShaderPassDestination = Framebuffer | null;
