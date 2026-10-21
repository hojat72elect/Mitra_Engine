import {ImageFiltering} from "./ImageFiltering";

/**
 * Parse the image filtering attribute value, if it doesn't match returns null
 */
export function parseImageFiltering(val: string): ImageFiltering | undefined {
    switch (val) {
        case ImageFiltering.Pixel:
            return ImageFiltering.Pixel;
        case ImageFiltering.Blended:
            return ImageFiltering.Blended;
        default:
            return undefined;
    }
}
