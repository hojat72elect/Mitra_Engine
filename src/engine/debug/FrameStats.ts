import {PhysicsStats} from "./PhysicsStats";
import {GraphicsStatistics} from "./GraphicsStatistics";
import {FrameStatistics} from "./FrameStatistics";
import {FrameDurationStats} from "./FrameDurationStats";
import {FrameActorStats} from "./FrameActorStats";

/**
 * Implementation of a frame's stats. Meant to have values copied via {@apilink FrameStats.reset}, avoid
 * creating instances of this every frame.
 */
export class FrameStats implements FrameStatistics {
    systemDuration: Record<string, number> = {};
    private _actorStats: FrameActorStats = {
        alive: 0,
        killed: 0,
        ui: 0,
        get remaining() {
            return this.alive - this.killed;
        },
        get total() {
            return this.remaining + this.ui;
        }
    };
    private _durationStats: FrameDurationStats = {
        update: 0,
        draw: 0,
        get total() {
            return this.update + this.draw;
        }
    };
    private _physicsStats: PhysicsStats = new PhysicsStats();
    private _graphicsStats: GraphicsStatistics = {
        drawCalls: 0,
        drawnImages: 0,
        rendererSwaps: 0
    };

    private _id: number = 0;

    /**
     * Gets the frame's id
     */
    public get id() {
        return this._id;
    }

    /**
     * Sets the frame's id
     */
    public set id(value: number) {
        this._id = value;
    }

    private _elapsedMs: number = 0;

    /**
     * Gets the frame's delta (time since last frame)
     */
    public get elapsedMs() {
        return this._elapsedMs;
    }

    /**
     * Sets the frame's delta (time since last frame). Internal use only.
     * @internal
     */
    public set elapsedMs(value: number) {
        this._elapsedMs = value;
    }

    private _fps: number = 0;

    /**
     * Gets the frame's frames-per-second (FPS)
     */
    public get fps() {
        return this._fps;
    }

    /**
     * Sets the frame's frames-per-second (FPS). Internal use only.
     * @internal
     */
    public set fps(value: number) {
        this._fps = value;
    }

    /**
     * Gets the frame's actor statistics
     */
    public get actors() {
        return this._actorStats;
    }

    /**
     * Gets the frame's duration statistics
     */
    public get duration() {
        return this._durationStats;
    }

    /**
     * Gets the frame's physics statistics
     */
    public get physics() {
        return this._physicsStats;
    }

    /**
     * Gets the frame's graphics statistics
     */
    public get graphics() {
        return this._graphicsStats;
    }

    /**
     * Zero out values or clone other IFrameStat stats. Allows instance reuse.
     * @param [otherStats] Optional stats to clone
     */
    public reset(otherStats?: FrameStatistics) {
        if (otherStats) {
            this.id = otherStats.id;
            this.elapsedMs = otherStats.elapsedMs;
            this.fps = otherStats.fps;
            this.actors.alive = otherStats.actors.alive;
            this.actors.killed = otherStats.actors.killed;
            this.actors.ui = otherStats.actors.ui;
            this.duration.update = otherStats.duration.update;
            this.duration.draw = otherStats.duration.draw;
            for (const key in otherStats.systemDuration) {
                this.systemDuration[key] = otherStats.systemDuration[key];
            }
            this._physicsStats.reset(otherStats.physics);
            this.graphics.drawCalls = otherStats.graphics.drawCalls;
            this.graphics.drawnImages = otherStats.graphics.drawnImages;
            this.graphics.rendererSwaps = otherStats.graphics.rendererSwaps;
        } else {
            this.id = this.elapsedMs = this.fps = 0;
            this.actors.alive = this.actors.killed = this.actors.ui = 0;
            this.duration.update = this.duration.draw = 0;
            this._physicsStats.reset();
            this.graphics.drawnImages = this.graphics.drawCalls = this.graphics.rendererSwaps = 0;
            for (const key in this.systemDuration) {
                this.systemDuration[key] = 0;
            }
        }
    }

    /**
     * Provides a clone of this instance.
     */
    public clone(): FrameStats {
        const fs = new FrameStats();

        fs.reset(this);

        return fs;
    }
}
