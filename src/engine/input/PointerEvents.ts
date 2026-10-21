import {PointerEvent} from "./PointerEvent";
import {WheelEvent} from "./WheelEvent";

export interface PointerEvents {
    move: PointerEvent;
    down: PointerEvent;
    up: PointerEvent;
    wheel: WheelEvent;
}

export const PointerEvents = {
    Move: 'move',
    Down: 'down',
    Up: 'up',
    Wheel: 'wheel'
};
