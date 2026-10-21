import {AffineMatrix} from '../../math';
import {Color} from '../../color';
import type {MitraGraphicsContextState} from './MitraGraphicsContext';

export class DrawCall {
    public z: number = 0;
    public priority: number = 0;
    public renderer: string = '';
    public transform: AffineMatrix = AffineMatrix.identity();
    public state: MitraGraphicsContextState = {
        z: 0,
        opacity: 1,
        tint: Color.White,
        material: null
    };
    public args: any[] = new Array(10);
}
