import {Graphic} from './Graphic';
import type {MitraGraphicsContext} from './context/MitraGraphicsContext';
import {Color} from '../color';
import {Vector} from '../math';
import {BoundingBox} from '../collision';
import {watch} from '../util/watch';
import type {ImageFiltering} from './ImageFiltering';
import {omit} from '../util';
import {ImageSourceAttributeConstants} from './ImageSourceAttributeConstants';
import {RasterOptions} from "./RasterOptions";

/**
 * A Raster is a Graphic that needs to be first painted to a HTMLCanvasElement before it can be drawn to the
 * {@apilink MitraGraphicsContext}. This is useful for generating custom images using the 2D canvas api.
 *
 * Implementors must implement the {@apilink Raster.execute} method to rasterize their drawing.
 */
export abstract class Raster extends Graphic {
    public filtering?: ImageFiltering;
    public lineCap: 'butt' | 'round' | 'square' = 'butt';
    public quality: number = 1;

    public _bitmap: HTMLCanvasElement;
    protected _ctx: CanvasRenderingContext2D;
    private _originalWidth?: number;
    private _originalHeight?: number;

    constructor(options?: RasterOptions) {
        super(omit({...options}, ['width', 'height'])); // rasters do some special sauce with width/height
        if (options) {
            this.quality = options.quality ?? this.quality;
            this.color = options.color ?? Color.Black;
            this.strokeColor = options?.strokeColor;
            this.smoothing = options.smoothing ?? this.smoothing;
            this.lineWidth = options.lineWidth ?? this.lineWidth;
            this.lineDash = options.lineDash ?? this.lineDash;
            this.lineCap = options.lineCap ?? this.lineCap;
            this.padding = options.padding ?? this.padding;
            this.filtering = options.filtering ?? this.filtering;
        }
        this._bitmap = document.createElement('canvas');
        // get the default canvas width/height as a fallback
        const bitmapWidth = options?.width ?? this._bitmap.width;
        const bitmapHeight = options?.height ?? this._bitmap.height;
        this.width = bitmapWidth;
        this.height = bitmapHeight;
        const maybeCtx = this._bitmap.getContext('2d');
        if (!maybeCtx) {
            /* istanbul ignore next */
            throw new Error('Browser does not support 2d canvas drawing, cannot create Raster graphic');
        } else {
            this._ctx = maybeCtx;
        }
    }

    private _dirty: boolean = true;

    /**
     * Gets whether the graphic is dirty, this means there are changes that haven't been re-rasterized
     */
    public get dirty() {
        return this._dirty;
    }

    /**
     * Gets or sets the current width of the Raster graphic. Setting the width will cause the raster
     * to be flagged dirty causing a re-raster on the next draw.
     *
     * Any `padding`s or `quality` set will be factored into the width
     */
    public override get width() {
        return Math.abs(this._getTotalWidth() * this.scale.x);
    }

    public override set width(value: number) {
        value /= Math.abs(this.scale.x);
        this._bitmap.width = value;
        this._originalWidth = value;
        this.flagDirty();
    }

    /**
     * Gets or sets the current height of the Raster graphic. Setting the height will cause the raster
     * to be flagged dirty causing a re-raster on the next draw.
     *
     * Any `padding` or `quality` set will be factored into the height
     */
    public override get height() {
        return Math.abs(this._getTotalHeight() * this.scale.y);
    }

    public override set height(value: number) {
        value /= Math.abs(this.scale.y);
        this._bitmap.height = value;
        this._originalHeight = value;
        this.flagDirty();
    }

    /**
     * Returns the local bounds of the Raster including the padding
     */
    public override get localBounds() {
        return BoundingBox.fromDimension(this._getTotalWidth() * this.scale.x, this._getTotalHeight() * this.scale.y, Vector.Zero);
    }

    private _smoothing: boolean = false;

    /**
     * Gets or sets the smoothing (anti-aliasing of the graphic). Setting the height will cause the raster
     * to be flagged dirty causing a re-raster on the next draw.
     */
    public get smoothing() {
        return this._smoothing;
    }

    public set smoothing(value: boolean) {
        this._smoothing = value;
        this.flagDirty();
    }

    private _color: Color = watch(Color.Black, () => this.flagDirty());

    /**
     * Gets or sets the fillStyle of the Raster graphic. Setting the fillStyle will cause the raster to be
     * flagged dirty causing a re-raster on the next draw.
     */
    public get color() {
        return this._color;
    }

    public set color(value) {
        this.flagDirty();
        this._color = watch(value, () => this.flagDirty());
    }

    private _strokeColor: Color | undefined;

    /**
     * Gets or sets the strokeStyle of the Raster graphic. Setting the strokeStyle will cause the raster to be
     * flagged dirty causing a re-raster on the next draw.
     */
    public get strokeColor() {
        return this._strokeColor;
    }

    public set strokeColor(value: Color | undefined) {
        this.flagDirty();
        if (value) {
            this._strokeColor = watch(value, () => this.flagDirty());
        }
    }

    private _lineWidth: number = 1;

    /**
     * Gets or sets the line width of the Raster graphic. Setting the lineWidth will cause the raster to be
     * flagged dirty causing a re-raster on the next draw.
     */
    public get lineWidth() {
        return this._lineWidth;
    }

    public set lineWidth(value) {
        this._lineWidth = value;
        this.flagDirty();
    }

    private _lineDash: number[] = [];

    public get lineDash() {
        return this._lineDash;
    }

    public set lineDash(value) {
        this._lineDash = value;
        this.flagDirty();
    }

    private _padding: number = 0;

    public get padding() {
        return this._padding;
    }

    public set padding(value: number) {
        this._padding = value;
        this.flagDirty();
    }

    public cloneRasterOptions(): RasterOptions {
        return {
            color: this.color ? this.color.clone() : undefined,
            strokeColor: this.strokeColor ? this.strokeColor.clone() : undefined,
            smoothing: this.smoothing,
            lineWidth: this.lineWidth,
            lineDash: this.lineDash,
            lineCap: this.lineCap,
            quality: this.quality,
            padding: this.padding
        };
    }

    /**
     * Flags the graphic as dirty, meaning it must be re-rasterized before draw.
     * This should be called any time the graphics state changes such that it affects the outputted drawing
     */
    public flagDirty() {
        this._dirty = true;
    }

    /**
     * Rasterize the graphic to a bitmap making it usable as in Mitra. Rasterize is called automatically if
     * the graphic is {@apilink Raster.dirty} on the next {@apilink Graphic.draw} call
     */
    public rasterize(): void {
        this._dirty = false;
        this._ctx.clearRect(0, 0, this._getTotalWidth(), this._getTotalHeight());
        this._ctx.save();
        this._applyRasterProperties(this._ctx);
        this.execute(this._ctx);
        this._ctx.restore();
    }

    /**
     * Executes drawing implementation of the graphic, this is where the specific drawing code for the graphic
     * should be implemented. Once `rasterize()` the graphic can be drawn to the {@apilink MitraGraphicsContext} via `draw(...)`
     * @param ctx Canvas to draw the graphic to
     */
    abstract execute(ctx: CanvasRenderingContext2D): void;

    protected _applyRasterProperties(ctx: CanvasRenderingContext2D) {
        this._bitmap.width = this._getTotalWidth() * this.quality;
        this._bitmap.height = this._getTotalHeight() * this.quality;
        // Do a bad thing to pass the filtering as an attribute
        this._bitmap.setAttribute(ImageSourceAttributeConstants.Filtering, this.filtering as any);
        this._bitmap.setAttribute(ImageSourceAttributeConstants.ForceUpload, 'true');
        ctx.scale(this.quality, this.quality);
        ctx.translate(this.padding, this.padding);
        ctx.imageSmoothingEnabled = this.smoothing;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash(this.lineDash ?? ctx.getLineDash());
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = this.strokeColor?.toString() ?? '';
        ctx.fillStyle = this.color?.toString();
    }

    protected _drawImage(ex: MitraGraphicsContext, x: number, y: number) {
        if (this._dirty) {
            this.rasterize();
        }
        ex.scale(1 / this.quality, 1 / this.quality);
        ex.drawImage(this._bitmap, x, y);
    }

    private _getTotalWidth() {
        return ((this._originalWidth ?? this._bitmap.width) + this.padding * 2) * 1;
    }

    private _getTotalHeight() {
        return ((this._originalHeight ?? this._bitmap.height) + this.padding * 2) * 1;
    }
}
