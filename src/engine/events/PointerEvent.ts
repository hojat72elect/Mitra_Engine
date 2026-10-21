import type {WheelDeltaMode} from '../input/WheelDeltaMode';
import {ExEvent} from './ExEvent';
import type {GlobalCoordinates} from "../math/GlobalCoordinates.ts";

abstract class PointerEvent extends ExEvent<'down' | 'up' | 'move' | 'cancel'> {
    constructor(
        public pointerId: number,
        public coordinates: GlobalCoordinates,
        public nativeEvent: Event
    ) {
        super();
    }
}

// @ts-ignore
class PointerUp extends PointerEvent {
    public readonly type = 'up';
}

// @ts-ignore
class PointerDown extends PointerEvent {
    public readonly type = 'down';
}

// @ts-ignore
class PointerMove extends PointerEvent {
    public readonly type = 'move';
}

// @ts-ignore
class PointerCancel extends PointerEvent {
    public readonly type = 'cancel';
}

// @ts-ignore
class Wheel extends ExEvent<'wheel'> {
    public readonly type = 'wheel';

    constructor(
        public x: number,
        public y: number,
        public pageX: number,
        public pageY: number,
        public screenX: number,
        public screenY: number,
        public index: number,
        public deltaX: number,
        public deltaY: number,
        public deltaZ: number,
        public deltaMode: WheelDeltaMode,
        public ev: Event
    ) {
        super();
    }
}
