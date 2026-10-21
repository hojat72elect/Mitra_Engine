import {Vector} from "../math";
import {Color} from "../color";

export interface GraphicOptions {
    /**
     * The width of the graphic
     */
    width?: number;
    /**
     * The height of the graphic
     */
    height?: number;
    /**
     * Should the graphic be flipped horizontally
     */
    flipHorizontal?: boolean;
    /**
     * Should the graphic be flipped vertically
     */
    flipVertical?: boolean;
    /**
     * The rotation of the graphic
     */
    rotation?: number;
    /**
     * The scale of the graphic
     */
    scale?: Vector;
    /**
     * The opacity of the graphic between (0 -1)
     */
    opacity?: number;
    /**
     * The tint of the graphic, this color will be multiplied by the original pixel colors
     */
    tint?: Color;
    /**
     * The origin of the drawing in pixels to use when applying transforms, by default it will be the center of the image in pixels
     */
    origin?: Vector;
}
