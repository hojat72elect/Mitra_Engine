import {MediaEvent} from "./MediaEvent";
import type {Sound} from "../resources/sound/sound.ts";
import type {WebAudioInstance} from "../resources/sound/WebAudioInstance.ts";

export class NativeSoundEvent extends MediaEvent {
    constructor(
        target: Sound,
        public track?: WebAudioInstance
    ) {
        super(target, 'NativeSoundEvent');
    }
}
