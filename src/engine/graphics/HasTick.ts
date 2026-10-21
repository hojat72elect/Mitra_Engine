export interface HasTick {
    /**
     * Optional property to tick any graphics EVEN when offscreen, this is useful when you want to keep animations synchronized
     * across your game scene.
     */
    shouldAlwaysTick?: boolean;

    /**
     *
     * @param elapsed The amount of real world time in milliseconds that has elapsed that must be updated in the animation
     * @param idempotencyToken Optional idempotencyToken prevents a ticking animation from updating twice per frame
     */
    tick(elapsed: number, idempotencyToken?: number): void;
}
