import type {NavigatorGamepadButton} from "./NavigatorGamepadButton";

/**
 * @internal
 */
export interface NavigatorGamepad {
    axes: number[];
    buttons: NavigatorGamepadButton[];
    connected: boolean;
    id: string;
    index: number;
    mapping: string;
    timestamp: number;
}
