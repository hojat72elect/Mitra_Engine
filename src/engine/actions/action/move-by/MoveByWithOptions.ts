import {nextActionId} from "../nextActionId";
import type {MoveByOptions} from "./MoveByOptions.ts";
import type {Action} from "../Action.ts";
import {vec, type Vector} from "../../../math/Vector.ts";
import {TransformComponent} from "../../../entity-component-system/components/TransformComponent.ts";
import {MotionComponent} from "../../../entity-component-system/components/MotionComponent.ts";
import {type Easing, linear} from "../../../math/easings.ts";
import type {Entity} from "../../../entity-component-system/Entity.ts";
import {clamp} from "../../../math/util.ts";
import {lerp, remap} from "../../../math/lerp.ts";

export class MoveByWithOptions implements Action {
    id = nextActionId();
    private _start!: Vector;
    private _end!: Vector;
    private _durationMs: number;
    private _tx: TransformComponent;
    private _started: boolean = false;
    private _currentMs: number;
    private _stopped: boolean = false;
    private _motion: MotionComponent;
    private _offset: Vector;
    private _easing: Easing = linear;

    constructor(
        public entity: Entity,
        options: MoveByOptions
    ) {
        this._offset = options.offset;

        this._easing = options.easing ?? this._easing;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        if (!this._tx) {
            throw new Error(`Entity ${entity.name} has no TransformComponent, can only MoveBy on Entities with TransformComponents.`);
        }
        this._durationMs = options.duration;
        this._currentMs = this._durationMs;
    }

    update(elapsed: number): void {
        if (!this._started) {
            this._start = this._tx.pos.clone();
            this._end = this._start.add(this._offset);
            this._started = true;
        }
        this._currentMs -= elapsed;
        const t = clamp(remap(0, this._durationMs, 0, 1, this._durationMs - this._currentMs), 0, 1);
        const currentPos = this._tx.pos;

        const newPosX = lerp(this._start.x, this._end.x, this._easing(t));
        const newPosY = lerp(this._start.y, this._end.y, this._easing(t));

        const seconds = elapsed / 1000;
        const velX = seconds === 0 ? 0 : (newPosX - currentPos.x) / seconds;
        const velY = seconds === 0 ? 0 : (newPosY - currentPos.y) / seconds;
        this._motion.vel.x = velX;
        this._motion.vel.y = velY;

        if (this.isComplete(this.entity)) {
            this._tx.pos = vec(this._end.x, this._end.y);
            this._motion.vel = vec(0, 0);
        }
    }

    public isComplete(entity: Entity): boolean {
        return this._stopped || this._currentMs <= 0;
    }

    public stop(): void {
        this._motion.vel = vec(0, 0);
        this._stopped = true;
        this._started = false;
        this._currentMs = 0;
    }

    public reset(): void {
        this._currentMs = this._durationMs;
        this._started = false;
        this._stopped = false;
    }
}