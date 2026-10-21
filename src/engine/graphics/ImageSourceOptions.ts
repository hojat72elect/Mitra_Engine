import {ImageFiltering} from "./ImageFiltering";
import {ImageWrapping} from "./ImageWrapping";
import type {ImageWrapConfiguration} from "./ImageWrapConfiguration";

export interface ImageSourceOptions {
    filtering?: ImageFiltering;
    wrapping?: ImageWrapConfiguration | ImageWrapping;
    bustCache?: boolean;
}