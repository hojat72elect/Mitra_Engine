import {ImageFiltering} from "./ImageFiltering";
import type {GraphicOptions} from "./GraphicOptions";
import {Color} from "../color";

export interface RasterOptions extends GraphicOptions {
    /**
     * Optionally specify a quality number, which is how much to scale the internal Raster. Default is 1.
     *
     * For example if the quality is set to 2, it doubles the internal raster bitmap in memory.
     *
     * Adjusting this value can be useful if you are working with small rasters.
     */
    quality?: number;
    /**
     * Optionally specify "smoothing" if you want antialiasing to apply to the raster's bitmap context, by default `false`
     */
    smoothing?: boolean;

    /**
     * Optionally specify the color of the raster's bitmap context, by default {@apilink Color.Black}
     */
    color?: Color;

    /**
     * Optionally specify the stroke color of the raster's bitmap context, by default undefined
     */
    strokeColor?: Color;

    /**
     * Optionally specify the line width of the raster's bitmap, by default 1 pixel
     */
    lineWidth?: number;

    /**
     * Optionally specify the line dash of the raster's bitmap, by default `[]` which means none
     */
    lineDash?: number[];

    /**
     * Optionally specify the line end style, default is "butt".
     */
    lineCap?: 'butt' | 'round' | 'square';

    /**
     * Optionally specify the padding to apply to the bitmap
     */
    padding?: number;

    /**
     * Optionally specify what image filtering mode should be used, {@apilink ImageFiltering.Pixel} for pixel art,
     * {@apilink ImageFiltering.Blended} for hi-res art
     *
     * By default unset, rasters defer to the engine antialiasing setting
     */
    filtering?: ImageFiltering;
}
