export interface DynamicTreeConfig {
    /**
     * Pad collider BoundingBox by a constant amount for purposes of potential pairs
     *
     * Default 5 pixels
     */
    boundsPadding?: number;

    /**
     * Factor to add to the collider BoundingBox, bounding box (dimensions += vel * dynamicTreeVelocityMultiplier);
     *
     * Default 2
     */
    velocityMultiplier?: number;
}