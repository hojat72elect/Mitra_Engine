import type {NavigatorGamepad} from "./NavigatorGamepad";

/**
 * @internal
 */
export interface NavigatorGamepads {
    getGamepads(): (NavigatorGamepad | undefined)[];
}
