import {FontUnit} from "./FontUnit";
import {FontStyle} from "./FontStyle";
import {TextAlign} from "./TextAlign";
import {BaseAlign} from "./BaseAlign";
import {TextDirection} from "./TextDirection";
import type {Color} from "../color";
import type {Vector} from "../math/Vector.ts";

/**
 * Font rendering option
 */
export interface FontOptions {
    /**
     * Optionally the size of the font in the specified {@apilink FontUnit} by default 10.
     */
    size?: number;
    /**
     * Optionally specify unit to measure fonts in, by default Pixels
     */
    unit?: FontUnit;
    /**
     * Optionally specify the font family, by default 'sans-serif'
     */
    family?: string;
    /**
     * Optionally specify the font style, by default Normal
     */
    style?: FontStyle;
    /**
     * Optionally set whether the font is bold, by default false
     */
    bold?: boolean;
    /**
     * Optionally specify the text align, by default Left
     */
    textAlign?: TextAlign;
    /**
     * Optionally specify the text base align, by default Alphabetic
     */
    baseAlign?: BaseAlign;
    /**
     * Optionally specify the text direction, by default LeftToRight
     */
    direction?: TextDirection;
    /**
     * Optionally override the text line height in pixels, useful for multiline text. If unset will use default.
     */
    lineHeight?: number | undefined;
    /**
     * Optionally specify the quality of the text bitmap, it is a multiplier on the size size, by default 2.
     * Higher quality text has a higher memory impact
     */
    quality?: number;
    /**
     * Optionally specify a text shadow, by default none is specified
     */
    shadow?: {
        blur?: number;
        offset?: Vector;
        color?: Color;
    };
}