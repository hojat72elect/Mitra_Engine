import {ImageSource} from "./ImageSource";
import type {SourceView} from "./SourceView";
import type {ImageFiltering} from "./ImageFiltering";
import type {ImageWrapConfiguration} from "./ImageWrapConfiguration";
import {ImageWrapping} from "./ImageWrapping";

export interface TiledSpriteOptions {
    image: ImageSource;
    /**
     * Source view into the {@link ImageSource image}
     */
    sourceView?: SourceView;
    /**
     * Optionally override {@link ImageFiltering filtering}
     */
    filtering?: ImageFiltering;
    /**
     * Optionally override {@link ImageWrapping wrapping} , default wrapping is Repeat for TiledSprite
     */
    wrapping?: ImageWrapConfiguration | ImageWrapping;
    /**
     * Total width in pixels for the tiling to take place over
     */
    width: number;
    /**
     * Total height in pixels for the tiling to take place over
     */
    height: number;
}
