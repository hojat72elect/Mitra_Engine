import {nextActionId} from "../nextActionId";
import {type Entity, MotionComponent, TransformComponent} from "../../../entity-component-system";
import {canonicalizeAngle, clamp, remap, RotationType, TwoPI} from "../../../math";
import {RotateByOptions} from "./RotateByOptions";
import {Action} from "../Action";

export class RotateByWithOptions implements Action {
    id = nextActionId();
    private _durationMs: number;
    private _tx: TransformComponent;
    private _started: boolean = false;
    private _currentMs: number;
    private _stopped: boolean = false;
    private _motion: MotionComponent;
    private _offset: number = 0;
    private _startAngle: number = 0;
    private _rotationType?: RotationType;
    private _travel: number = 0;
    private _currentAngle: number = 0;

    constructor(
        public entity: Entity,
        options: RotateByOptions
    ) {
        this._offset = options.angleRadiansOffset;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        if (!this._tx) {
            throw new Error(`Entity ${entity.name} has no TransformComponent, can only RotateBy on Entities with TransformComponents.`);
        }
        this._durationMs = options.duration;
        this._rotationType = options.rotationType;
        this._currentMs = this._durationMs;
    }

    update(elapsed: number): void {
        if (!this._started) {
            this._startAngle = this._tx.rotation;
            this._currentAngle = this._startAngle;
            // The two canonical paths to the target orientation: positive in [0, 2PI), negative in [-2PI, 0).
            // A non-zero full-turn multiple targets the starting orientation; treat it as one full turn so
            // directional rotation types still revolve instead of degenerating to 0 or -2PI arbitrarily
            const canonicalOffset = canonicalizeAngle(this._offset);
            const isFullTurn = canonicalOffset === 0 && this._offset !== 0;
            const positivePath = isFullTurn ? TwoPI : canonicalOffset;
            const negativePath = isFullTurn ? -TwoPI : canonicalOffset - TwoPI;
            switch (this._rotationType) {
                case undefined:
                    // No explicit rotation type: rotate by exactly the signed offset, preserving full turns
                    this._travel = this._offset;
                    break;
                case RotationType.ShortestPath:
                    this._travel = isFullTurn ? 0 : Math.abs(positivePath) <= Math.abs(negativePath) ? positivePath : negativePath;
                    break;
                case RotationType.LongestPath:
                    this._travel = isFullTurn
                        ? Math.sign(this._offset) * TwoPI
                        : Math.abs(positivePath) > Math.abs(negativePath)
                            ? positivePath
                            : negativePath;
                    break;
                case RotationType.Clockwise:
                    this._travel = positivePath;
                    break;
                case RotationType.CounterClockwise:
                    this._travel = negativePath;
                    break;
            }
            if (this._offset === 0) {
                this._travel = 0;
            }
            this._started = true;
        }
        this._currentMs -= elapsed;
        const t = clamp(remap(0, this._durationMs, 0, 1, this._durationMs - this._currentMs), 0, 1);
        const newAngle = this._startAngle + this._travel * t;
        const seconds = elapsed / 1000;
        // Track the un-canonicalized angle so wrapping the transform's rotation doesn't spike velocity
        const rx = seconds === 0 ? 0 : (newAngle - this._currentAngle) / seconds;
        this._currentAngle = newAngle;
        this._motion.angularVelocity = rx;

        if (this.isComplete()) {
            this._tx.rotation = canonicalizeAngle(this._startAngle + this._travel);
            this._motion.angularVelocity = 0;
        }
    }

    public isComplete(): boolean {
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