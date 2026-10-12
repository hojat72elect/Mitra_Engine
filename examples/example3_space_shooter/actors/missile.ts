import {Actor, Animation, AnimationStrategy, Engine, PreCollisionEvent, Vector} from "excalibur";
import {gameSheet, Sounds} from "../resources";
import {Bullet} from "./bullet";

export class Missile extends Actor {
    constructor() {
        super({
            pos: Vector.Zero,
            width: 60,
            height: 20
        });

        this.on('precollision', this.onPreCollision);
        this.on('exitviewport', () => {
            Sounds.rocketSound.stop();
            this.kill();
        });
    }

    onInitialize(engine: Engine) {
        const anim = Animation.fromSpriteSheet(gameSheet, [13, 14, 15], 50, AnimationStrategy.Loop);
        anim.scale = new Vector(3, 3);
    }

    onPreCollision(evt: PreCollisionEvent) {
        if (!(evt.other instanceof Bullet)) {
            Sounds.rocketSound.stop();
            Sounds.explodeSound.play();
            this.kill();
        }
    }
}