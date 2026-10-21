import {nextActionId} from "../nextActionId";
import type {Action} from "../Action";
import {TransformComponent} from "../../../entity-component-system/components/TransformComponent.ts";
import {MotionComponent} from "../../../entity-component-system/components/MotionComponent.ts";
import {Vector} from "../../../math/Vector.ts";
import type {Entity} from "../../../entity-component-system/Entity.ts";

export class ScaleBy implements Action {
    id = nextActionId();
    public x!: number;
    public y!: number;
    private _tx: TransformComponent;
    private _motion: MotionComponent;
    private _startScale!: Vector;
    private _endScale!: Vector;
    private _offset: Vector;
    private _distanceX!: number;
    private _distanceY!: number;
    private _directionX!: number;
    private _directionY!: number;
    private _started = false;
    private _stopped = false;
    private _speedX: number;
    private _speedY: number;

    constructor(entity: Entity, scaleOffsetX: number, scaleOffsetY: number, speed: number) {
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._offset = new Vector(scaleOffsetX, scaleOffsetY);
        this._speedX = this._speedY = speed;
    }

    public update(elapsed: number): void {
        if (!this._started) {
            this._started = true;
            this._startScale = this._tx.scale.clone();
            this._endScale = this._startScale.add(this._offset);
            this._distanceX = Math.abs(this._endScale.x - this._startScale.x);
            this._distanceY = Math.abs(this._endScale.y - this._startScale.y);
            this._directionX = this._endScale.x < this._startScale.x ? -1 : 1;
            this._directionY = this._endScale.y < this._startScale.y ? -1 : 1;
        }

        this._motion.scaleFactor.x = this._speedX * this._directionX;
        this._motion.scaleFactor.y = this._speedY * this._directionY;

        if (this.isComplete()) {
            this._tx.scale = this._endScale;
            this._motion.scaleFactor.x = 0;
            this._motion.scaleFactor.y = 0;
        }
    }

    public isComplete(): boolean {
        return (
            this._stopped ||
            (Math.abs(this._tx.scale.x - this._startScale.x) >= this._distanceX - 0.01 &&
                Math.abs(this._tx.scale.y - this._startScale.y) >= this._distanceY - 0.01)
        );
    }

    public stop(): void {
        this._motion.scaleFactor.x = 0;
        this._motion.scaleFactor.y = 0;
        this._stopped = true;
        this._started = false;
    }

    public reset(): void {
        this._started = false;
        this._stopped = false;
    }
}