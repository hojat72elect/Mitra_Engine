import colorBlindCorrectSource from './color-blind-fragment.glsl?raw';
import type {PostProcessor} from './PostProcessor';
import {ColorBlindnessMode} from './ColorBlindnessMode';
import type {MitraGraphicsContextWebgl} from '../context/MitraGraphicsContextWebgl';
import type {Framebuffer} from '../context/Framebuffer';
import {ShaderPass} from '../context/shader-pipeline/ShaderPass';

export class ColorBlindnessPostProcessor implements PostProcessor {
    private _pass!: ShaderPass;

    constructor(
        private _colorBlindnessMode: ColorBlindnessMode,
        simulate = false
    ) {
        this._simulate = simulate;
    }

    private _simulate = false;

    get simulate(): boolean {
        return this._simulate;
    }

    set simulate(value: boolean) {
        this._simulate = value;
        if (this._pass) {
            this._pass.uniforms.u_simulate = value;
        }
    }

    get colorBlindnessMode(): ColorBlindnessMode {
        return this._colorBlindnessMode;
    }

    set colorBlindnessMode(colorBlindMode: ColorBlindnessMode) {
        this._colorBlindnessMode = colorBlindMode;
        if (this._pass) {
            if (this._colorBlindnessMode === ColorBlindnessMode.Protanope) {
                this._pass.uniforms.u_type = 0;
            } else if (this._colorBlindnessMode === ColorBlindnessMode.Deuteranope) {
                this._pass.uniforms.u_type = 1;
            } else if (this._colorBlindnessMode === ColorBlindnessMode.Tritanope) {
                this._pass.uniforms.u_type = 2;
            }
        }
    }

    initialize(graphicsContext: MitraGraphicsContextWebgl): void {
        this._pass = new ShaderPass({
            graphicsContext,
            name: 'color blindness',
            fragmentSource: colorBlindCorrectSource
        });
        this.simulate = this._simulate;
        this.colorBlindnessMode = this._colorBlindnessMode;
    }

    process(source: Framebuffer, destination: Framebuffer): void {
        this._pass.draw(source, destination);
    }
}
