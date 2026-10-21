import {ImageWrapping} from "./ImageWrapping";

export function parseImageWrapping(val: string): ImageWrapping {
    switch (val) {
        case ImageWrapping.Clamp:
            return ImageWrapping.Clamp;
        case ImageWrapping.Repeat:
            return ImageWrapping.Repeat;
        case ImageWrapping.Mirror:
            return ImageWrapping.Mirror;
        default:
            return ImageWrapping.Clamp;
    }
}
