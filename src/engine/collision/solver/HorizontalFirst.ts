import {ContactBias} from "./ContactBias";

/**
 * Horizontal First contact solve bias Used by the {@apilink ArcadeSolver} to sort contacts
 */
export const HorizontalFirst: ContactBias = {
    horizontal: 1,
    vertical: 2
} as const;