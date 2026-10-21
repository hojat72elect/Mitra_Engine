import {MitraGraphicsContextWebgl} from "./MitraGraphicsContextWebgl";
import {ImageFiltering} from "../ImageFiltering";
import {ImageWrapConfiguration} from "../ImageWrapConfiguration";
import {ImageWrapping} from "../ImageWrapping";

export interface FramebufferOptions {
    graphicsContext: MitraGraphicsContextWebgl;
    width: number;
    height: number;
    /**
     * How this framebuffer's texture is sampled when used as a source.
     *
     * Default {@apilink ImageFiltering.Pixel} (nearest), matching the engine's frame targets which are
     * only ever sampled 1:1. Pass {@apilink ImageFiltering.Blended} (linear) for anything that samples
     * at a different resolution, like downsample/upsample blur chains.
     */
    filtering?: ImageFiltering;
    /**
     * How this framebuffer's texture wraps when sampled outside 0-1 UVs, default {@apilink ImageWrapping.Clamp}
     */
    wrapping?: ImageWrapConfiguration | ImageWrapping;
    /**
     * Match the canvas transparency semantics, used to pick a compatible blit format. Default true.
     */
    transparency?: boolean;
}
