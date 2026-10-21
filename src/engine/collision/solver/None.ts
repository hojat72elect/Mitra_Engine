import type {ContactBias} from "./ContactBias";

/**
 * None value, {@apilink ArcadeSolver} sorts contacts using distance by default
 */
export const None: ContactBias = {
    horizontal: 0,
    vertical: 0
} as const;