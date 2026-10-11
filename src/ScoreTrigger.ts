import {Actor, Collider, vec, Vector} from "excalibur";
import {Level} from "./Level";
import {Config} from "./Config";
import {Resources} from "./Resources";
import {Bird} from "./Bird";

export class ScoreTrigger extends Actor {
    level: Level

    constructor(pos: Vector, level: Level) {
        super({
            pos,
            width: 32,
            height: Config.PipeGap,
            anchor: vec(0, 0),
            vel: vec(-Config.PipeSpeed, 0)
        })
        this.level = level;

        this.on('exitviewport', () => {
            this.kill();
        });
    }

    override onCollisionStart(_self: Collider, other: Collider): void {
        if (other.owner instanceof Bird) {
            this.level.incrementScore();
            Resources.ScoreSound.play();
        }
    }
}
