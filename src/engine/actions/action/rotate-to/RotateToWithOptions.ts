import {nextActionId} from "../nextActionId";
import {type Entity, MotionComponent, TransformComponent} from "../../../entity-component-system";
import {clamp, lerpAngle, remap, RotationType} from "../../../math";
import type {Action} from "../Action.ts";
import type {RotateToOptions} from "./RotateToOptions.ts";

export class RotateToWithOptions implements Action {
    id = nextActionId();
    private _durationMs: number;
    private _tx: TransformComponent;
    private _started: boolean = false;
    private _currentMs: number;
    private _stopped: boolean = false;
    private _motion: MotionComponent;
    private _endAngle: number = 0;
    private _startAngle: number = 0;
    private _rotationType: RotationType;

    constructor(
        public entity: Entity,
        options: RotateToOptions
    ) {
        this._endAngle = options.angle;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        if (!this._tx) {
            throw new Error(`Entity ${entity.name} has no TransformComponent, can only RotateTo on Entities with TransformComponents.`);
        }
        this._durationMs = options.duration;
        this._rotationType = options.rotationType ?? RotationType.ShortestPath;
        this._currentMs = this._durationMs;
    }

    update(elapsed: number): void {
        if (!this._started) {
            this._startAngle = this._tx.rotation;
            this._started = true;
        }
        this._currentMs -= elapsed;
        const t = clamp(remap(0, this._durationMs, 0, 1, this._durationMs - this._currentMs), 0, 1);
        const newAngle = lerpAngle(this._startAngle, this._endAngle, this._rotationType, t);
        const currentAngle = this._tx.rotation;

        const seconds = elapsed / 1000;
        const rx = seconds === 0 ? 0 : (newAngle - currentAngle) / seconds;
        this._motion.angularVelocity = rx;

        if (this.isComplete(this.entity)) {
            this._tx.rotation = this._endAngle;
            this._motion.angularVelocity = 0;
        }
    }

    public isComplete(entity: Entity): boolean {
        return this._stopped || this._currentMs < 0;
    }

    public stop(): void {
        this._motion.angularVelocity = 0;
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