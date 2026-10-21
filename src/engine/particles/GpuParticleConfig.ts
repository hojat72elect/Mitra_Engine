import type {ParticleConfig} from "./particles";
import {Sprite} from "../graphics";

export interface GpuParticleConfig extends ParticleConfig {
    /**
     * Only Sprite graphics are supported in GPU particles at the moment
     */
    graphic?: Sprite;
    /**
     * Set the maximum particles to use for this emitter
     */
    maxParticles?: number;
}
