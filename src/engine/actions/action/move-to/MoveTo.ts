import {nextActionId} from "../nextActionId";
import type {Action} from "../Action.ts";
import {vec, Vector} from "../../../math/Vector.ts";
import {MotionComponent} from "../../../entity-component-system/components/MotionComponent.ts";
import {TransformComponent} from "../../../entity-component-system/components/TransformComponent.ts";
import type {Entity} from "../../../entity-component-system/Entity.ts";

export class MoveTo implements Action {
    id = nextActionId();
    public x!: number;
    public y!: number;
    private _tx: TransformComponent;
    private _motion: MotionComponent;
    private _start!: Vector;
    private _end: Vector;
    private _dir!: Vector;
    private _speed: number;
    private _distance!: number;
    private _started = false;
    private _stopped = false;

    constructor(
        public entity: Entity,
        destX: number,
        destY: number,
        speed: number
    ) {
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._end = new Vector(destX, destY);
        this._speed = speed;
    }

    public update(elapsed: number): void {
        if (!this._started) {
            this._started = true;
            this._start = new Vector(this._tx.pos.x, this._tx.pos.y);
            this._distance = this._start.distance(this._end);
            this._dir = this._end.sub(this._start).normalize();
        }
        const m = this._dir.scale(this._speed);
        this._motion.vel = vec(m.x, m.y);

        if (this.isComplete(this.entity)) {
            this._tx.pos = vec(this._end.x, this._end.y);
            this._motion.vel = vec(0, 0);
        }
    }

    public isComplete(entity: Entity): boolean {
        const tx = entity.get(TransformComponent);
        return this._stopped || new Vector(tx.pos.x, tx.pos.y).distance(this._start) >= this._distance;
    }

    public stop(): void {
        this._motion.vel = vec(0, 0);
        this._stopped = true;
        this._started = false;
    }

    public reset(): void {
        this._started = false;
        this._stopped = false;
    }
}