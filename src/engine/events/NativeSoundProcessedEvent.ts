import {MediaEvent} from "./MediaEvent";
import type {Sound} from "../resources/sound/sound.ts";

export class NativeSoundProcessedEvent extends MediaEvent {
    public data: string | AudioBuffer;

    constructor(
        target: Sound,
        private _processedData: string | AudioBuffer
    ) {
        super(target, 'NativeSoundProcessedEvent');

        this.data = this._processedData;
    }
}
