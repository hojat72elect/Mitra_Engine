import {Random, Timer, vec} from "excalibur";
import {Pipe} from "./Pipe.ts";
import {Config} from "./Config.ts";
import {Level} from "./Level.ts";
import {ScoreTrigger} from "./ScoreTrigger.ts";

export class PipeFactory {
    private timer: Timer;

    constructor(
        private level: Level,
        private random: Random,
        intervalMs: number) {
        this.timer = new Timer({
            interval: intervalMs,
            repeats: true,
            action: () => this.spawnPipes()
        });
        this.level.add(this.timer);
    }

    spawnPipes() {
        const randomPipePosition = this.random.floating(0, this.level.engine.screen.resolution.height - Config.PipeGap);

        const bottomPipe = new Pipe(
            vec(this.level.engine.screen.drawWidth, randomPipePosition + Config.PipeGap),
            'bottom'
        );
        this.level.add(bottomPipe);

        const topPipe = new Pipe(
            vec(this.level.engine.screen.drawWidth, randomPipePosition),
            'top'
        );
        this.level.add(topPipe);

        const scoreTrigger = new ScoreTrigger(
            vec(this.level.engine.screen.drawWidth, randomPipePosition),
            this.level
        );
        this.level.add(scoreTrigger);

    }

    start() {
        this.timer.start();
    }

    reset() {
        for (const actor of this.level.actors) {
            if (actor instanceof Pipe ||
                actor instanceof ScoreTrigger
            ) {
                actor.kill();
            }
        }
    }

    stop() {
        this.timer.stop();
        for (const actor of this.level.actors) {
            if (actor instanceof Pipe ||
                actor instanceof ScoreTrigger
            ) {
                actor.vel = vec(0, 0);
            }
        }
    }
}