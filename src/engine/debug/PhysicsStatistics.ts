import type {CollisionContact} from "../collision/detection/CollisionContact";

/**
 * Represents physics stats for the current frame
 */
export interface PhysicsStatistics {
    /**
     * Gets the number of broadphase collision pairs which
     */
    pairs: number;

    /**
     * Gets the number of actual collisions
     */
    collisions: number;

    /**
     * Copy of the current frame contacts (only updated if debug is toggled on)
     */
    contacts: Map<string, CollisionContact>;

    /**
     * Gets the number of fast moving bodies using raycast continuous collisions in the scene
     */
    fastBodies: number;

    /**
     * Gets the number of bodies that had a fast body collision resolution
     */
    fastBodyCollisions: number;

    /**
     * Gets the time it took to calculate the broadphase pairs
     */
    broadphase: number;

    /**
     * Gets the time it took to calculate the narrowphase
     */
    narrowphase: number;
}