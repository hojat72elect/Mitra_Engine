import {ImageFiltering} from "./ImageFiltering";
import {ImageWrapping} from "./ImageWrapping";
import {ImageWrapConfiguration} from "./ImageWrapConfiguration";

export interface ImageSourceOptions {
    filtering?: ImageFiltering;
    wrapping?: ImageWrapConfiguration | ImageWrapping;
    bustCache?: boolean;
}