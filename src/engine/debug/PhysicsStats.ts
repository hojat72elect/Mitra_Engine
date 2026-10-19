import type {CollisionContact} from "../collision";
import {PhysicsStatistics} from "./PhysicsStatistics";

export class PhysicsStats implements PhysicsStatistics {
    private _pairs: number = 0;

    public get pairs(): number {
        return this._pairs;
    }

    public set pairs(value: number) {
        this._pairs = value;
    }

    private _collisions: number = 0;

    public get collisions(): number {
        return this._collisions;
    }

    public set collisions(value: number) {
        this._collisions = value;
    }

    private _contacts: Map<string, CollisionContact> = new Map();

    public get contacts(): Map<string, CollisionContact> {
        return this._contacts;
    }

    public set contacts(contacts: Map<string, CollisionContact>) {
        this._contacts = contacts;
    }

    private _fastBodies: number = 0;

    public get fastBodies(): number {
        return this._fastBodies;
    }

    public set fastBodies(value: number) {
        this._fastBodies = value;
    }

    private _fastBodyCollisions: number = 0;

    public get fastBodyCollisions(): number {
        return this._fastBodyCollisions;
    }

    public set fastBodyCollisions(value: number) {
        this._fastBodyCollisions = value;
    }

    private _broadphase: number = 0;

    public get broadphase(): number {
        return this._broadphase;
    }

    public set broadphase(value: number) {
        this._broadphase = value;
    }

    private _narrowphase: number = 0;

    public get narrowphase(): number {
        return this._narrowphase;
    }

    public set narrowphase(value: number) {
        this._narrowphase = value;
    }

    /**
     * Zero out values or clone other IPhysicsStats stats. Allows instance reuse.
     * @param [otherStats] Optional stats to clone
     */
    public reset(otherStats?: PhysicsStatistics) {
        if (otherStats) {
            this.pairs = otherStats.pairs;
            this.collisions = otherStats.collisions;
            this.contacts = otherStats.contacts;
            this.fastBodies = otherStats.fastBodies;
            this.fastBodyCollisions = otherStats.fastBodyCollisions;
            this.broadphase = otherStats.broadphase;
            this.narrowphase = otherStats.narrowphase;
        } else {
            this.pairs = this.collisions = this.fastBodies = 0;
            this.fastBodyCollisions = this.broadphase = this.narrowphase = 0;
            this.contacts.clear();
        }
    }

    /**
     * Provides a clone of this instance.
     */
    public clone(): PhysicsStatistics {
        const ps = new PhysicsStats();

        ps.reset(this);

        return ps;
    }
}