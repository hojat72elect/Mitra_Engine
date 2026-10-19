import {MediaEvent} from "./MediaEvent";
import {Sound, WebAudioInstance} from "../resources";

export class NativeSoundEvent extends MediaEvent {
    constructor(
        target: Sound,
        public track?: WebAudioInstance
    ) {
        super(target, 'NativeSoundEvent');
    }
}
