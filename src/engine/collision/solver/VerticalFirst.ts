import type {ContactBias} from "./ContactBias";

/**
 * Vertical First contact solve bias Used by the {@apilink ArcadeSolver} to sort contacts
 */
export const VerticalFirst: ContactBias = {
    vertical: 1,
    horizontal: 2
} as const;