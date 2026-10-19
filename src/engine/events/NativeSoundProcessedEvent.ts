import type {Sound} from "../resources";
import {MediaEvent} from "./MediaEvent";

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
