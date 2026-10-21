import type {BoundingBox} from '../collision';
import type {Color} from '../color';
import type {MitraGraphicsContext} from './context/MitraGraphicsContext';

/**
 * @internal
 */
export interface FontRenderer {
    measureText(text: string): BoundingBox;

    render(ex: MitraGraphicsContext, text: string, color: Color, x: number, y: number): void;
}
