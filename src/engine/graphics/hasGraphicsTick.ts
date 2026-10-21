import {Graphic} from "./Graphic";
import type {HasTick} from "./HasTick";

/**
 * Type guard for checking if a Graphic HasTick (used for graphics that change over time like animations)
 * @param graphic
 */
export function hasGraphicsTick(graphic: Graphic): graphic is Graphic & HasTick {
    return !!(graphic as unknown as HasTick).tick;
}