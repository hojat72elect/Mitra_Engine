import {nextActionId} from "../nextActionId";
import type {Action} from "../Action.ts";
import {RotationType} from "../../../math/RotationType.ts";
import {TwoPI} from "../../../math/util.ts";
import {MotionComponent} from "../../../entity-component-system/components/MotionComponent.ts";
import {TransformComponent} from "../../../entity-component-system/components/TransformComponent.ts";
import type {Entity} from "../../../entity-component-system/Entity.ts";

export class RotateTo implements Action {
    id = nextActionId();
    public x!: number;
    public y!: number;
    private _tx: TransformComponent;
    private _motion: MotionComponent;
    private _start!: number;
    private _end: number;
    private _speed: number;
    private _rotationType: RotationType;
    private _direction!: number;
    private _distance!: number;
    private _shortDistance!: number;
    private _longDistance!: number;
    private _shortestPathIsPositive!: boolean;
    private _currentNonCannonAngle!: number;
    private _started = false;
    private _stopped = false;

    constructor(entity: Entity, angle: number, speed: number, rotationType?: RotationType) {
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._end = angle;
        this._speed = speed;
        this._rotationType = rotationType || RotationType.ShortestPath;
    }

    public update(elapsed: number): void {
        if (!this._started) {
            this._started = true;
            this._start = this._tx.rotation;
            this._currentNonCannonAngle = this._tx.rotation;
            const distance1 = Math.abs(this._end - this._start);
            const distance2 = TwoPI - distance1;
            if (distance1 > distance2) {
                this._shortDistance = distance2;
                this._longDistance = distance1;
            } else {
                this._shortDistance = distance1;
                this._longDistance = distance2;
            }

            this._shortestPathIsPositive = (this._start - this._end + TwoPI) % TwoPI >= Math.PI;

            switch (this._rotationType) {
                case RotationType.ShortestPath:
                    this._distance = this._shortDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = 1;
                    } else {
                        this._direction = -1;
                    }
                    break;
                case RotationType.LongestPath:
                    this._distance = this._longDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = -1;
                    } else {
                        this._direction = 1;
                    }
                    break;
                case RotationType.Clockwise:
                    this._direction = 1;
                    if (this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    } else {
                        this._distance = this._longDistance;
                    }
                    break;
                case RotationType.CounterClockwise:
                    this._direction = -1;
                    if (!this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    } else {
                        this._distance = this._longDistance;
                    }
                    break;
            }
        }

        this._motion.angularVelocity = this._direction * this._speed;
        this._currentNonCannonAngle += this._direction * this._speed * (elapsed / 1000);

        if (this.isComplete()) {
            this._tx.rotation = this._end;
            this._motion.angularVelocity = 0;
            this._stopped = true;
        }
    }

    public isComplete(): boolean {
        const distanceTraveled = Math.abs(this._currentNonCannonAngle - this._start);
        return this._stopped || distanceTraveled >= Math.abs(this._distance);
    }

    public stop(): void {
        this._motion.angularVelocity = 0;
        this._stopped = true;
        this._started = false;
    }

    public reset(): void {
        this._started = false;
        this._stopped = false;
    }
}