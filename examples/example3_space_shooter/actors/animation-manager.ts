import {Actor, Animation, CollisionType, Engine, type ExcaliburGraphicsContext, Vector} from "excalibur";

interface AnimationNode {
    pos: Vector,
    anim: Animation
}

export class AnimationManager extends Actor {
    private animations: AnimationNode[] = [];

    constructor() {
        super({
            pos: Vector.Zero,
            width: 0,
            height: 0,
            collisionType: CollisionType.PreventCollision,
        });
        this.graphics.onPostDraw = (ctx) => this.drawAnimations(ctx);
    }

    play(animation: Animation, pos: Vector) {
        this.animations.push({
            anim: animation.clone(),
            pos: pos.clone()
        });
    }

    onPostUpdate(engine: Engine, elapsed: number) {
        this.animations.forEach(a => a.anim.tick(elapsed, engine.stats.currFrame.id));
        this.animations = this.animations.filter(a => !a.anim.done);
    }

    // PostDraw gives the rendering context and the time between frames
    drawAnimations(ctx: ExcaliburGraphicsContext) {
        for (let node of this.animations) {
            node.anim.draw(ctx, node.pos.x - node.anim.width / 2, node.pos.y - node.anim.height / 2);
        }
    }
}

const animManager = new AnimationManager();
export {animManager};