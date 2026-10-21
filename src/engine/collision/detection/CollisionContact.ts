import type {Collider} from '../colliders/Collider';
import {Pair} from './Pair';
import {BodyComponent} from '../BodyComponent';
import {SeparationInfo} from "../colliders/SeparationInfo";
import {cloneSeparationInfo} from "../colliders/cloneSeparationInfo";
import type {Vector} from "../../math/Vector.ts";

/**
 * Collision contacts are used internally by Mitra to resolve collision between colliders. This
 * Pair prevents collisions from being evaluated more than one time
 */
export class CollisionContact {
    /**
     * Currently the ids between colliders
     */
    readonly id: string;
    /**
     * The first collider in the collision
     */
    colliderA: Collider;
    /**
     * The second collider in the collision
     */
    colliderB: Collider;
    /**
     * The minimum translation vector to resolve overlap, pointing away from colliderA
     */
    mtv: Vector;
    /**
     * World space contact points between colliderA and colliderB
     */
    points: Vector[];
    /**
     * Local space contact points between colliderA and colliderB
     */
    localPoints: Vector[];
    /**
     * The collision normal, pointing away from colliderA
     */
    normal: Vector;
    /**
     * The collision tangent
     */
    tangent: Vector;
    /**
     * Information about the specifics of the collision contact separation
     */
    info: SeparationInfo;
    bodyA: BodyComponent | null = null;
    bodyB: BodyComponent | null = null;
    private _canceled = false;
    private _persisted = false;

    constructor(
        colliderA: Collider,
        colliderB: Collider,
        mtv: Vector,
        normal: Vector,
        tangent: Vector,
        points: Vector[],
        localPoints: Vector[],
        info: SeparationInfo
    ) {
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.mtv = mtv;
        this.normal = normal;
        this.tangent = tangent;
        this.points = points;
        this.localPoints = localPoints;
        this.info = info;
        this.id = Pair.calculatePairHash(colliderA.id, colliderB.id);
        if (colliderA.composite || colliderB.composite) {
            // Add on the parent composite pair for start/end contact if 'together'
            const colliderAId = colliderA.composite?.compositeStrategy === 'separate' ? colliderA.id : (colliderA.composite?.id ?? colliderA.id);
            const colliderBId = colliderB.composite?.compositeStrategy === 'separate' ? colliderB.id : (colliderB.composite?.id ?? colliderB.id);
            this.id += '|' + Pair.calculatePairHash(colliderAId, colliderBId);
        }
        if (this.colliderA.owner) {
            this.bodyA = this.colliderA.owner.get(BodyComponent);
        }
        if (this.colliderB.owner) {
            this.bodyB = this.colliderB.owner.get(BodyComponent);
        }
    }

    /**
     * Takes ownership of the pooled narrowphase data so this contact can be carried across frames without being
     * detected again, used for contacts between bodies that can't move (asleep, or asleep against fixed geometry)
     */
    public persist(): void {
        if (this._persisted) {
            return;
        }
        this._persisted = true;
        if (this.info) {
            this.info = cloneSeparationInfo(this.info);
        }
    }

    public isCanceled() {
        return this._canceled;
    }

    public cancel(): void {
        this._canceled = true;
    }

    /**
     * Biases the contact so that the given collider is colliderA
     */
    public bias(collider: Collider) {
        if (collider !== this.colliderA && collider !== this.colliderB) {
            throw new Error('Collider must be either colliderA or colliderB from this contact');
        }

        if (collider === this.colliderA) {
            return this;
        }

        const colliderA = this.colliderA;
        const colliderB = this.colliderB;

        this.colliderB = colliderA;
        this.colliderA = colliderB;
        this.mtv = this.mtv.negate();
        this.normal = this.normal.negate();
        this.tangent = this.tangent.negate();

        return this;
    }
}
