/**
 * The current Mitra version string
 * @description `process.env.__EX_VERSION` gets replaced by Webpack on build
 */
export const EX_VERSION = typeof process !== 'undefined' ? process.env.__EX_VERSION : undefined;
import {polyfill} from './polyfill';
// Events namespace
import * as events from './events';
// ex.Util namespaces
import * as util from './util/index';

polyfill();

// This file is used as the bundle entry point and exports everything
// that will be exposed as the `ex` global variable.
export * from './Flags';
export * from './id';
export * from './engine';
export * from './garbage-collector';
export * from './screen';
export * from './actor';
export * from './math/index';
export * from './camera';
export * from './EventEmitter';
export * from './events/MediaEvent';
export * from './events';
export * from './label';
export {TextDirection} from './graphics/TextDirection';
export {FontStyle} from './graphics/FontStyle';
export {TextAlign} from "./graphics/TextAlign";
export {FontUnit} from "./graphics/FontUnit";
export {BaseAlign} from "./graphics/BaseAlign";
export * from './particles/index';
export * from './scene';
export * from './Plugin';

export * from './tile-map/index';

export * from './lighting/index';

export * from './timer';
export * from './trigger';
export * from './ScreenElement';

export * from './interfaces/index';
export * from './resources/index';

export * from './entity-component-system/index';

export * from './director/index';

export * from './color';

export * from './graphics/index';

export {events as Events};

export {WheelEvent} from './input/WheelEvent';
export {PointerEvent} from './input/PointerEvent';
export {WheelDeltaMode} from './input/WheelDeltaMode';
export {PointerButton} from './input/PointerButton';
export {NativePointerButton} from './input/NativePointerButton';
export type {CapturePointerConfig} from './input/CapturePointerConfig';
export type {PointerInitOptions} from "./input/PointerInitOptions";
export {PointerEventReceiver} from './input/PointerEventReceiver';
export {PointerAbstraction} from './input/PointerAbstraction';
export {PointerComponent} from './input/PointerComponent';
export {PointerSystem} from './input/PointerSystem';
export {PointerType} from './input/PointerType';
export {PointerScope} from './input/PointerScope';
export type {NavigatorGamepads} from './input/NavigatorGamepads';
export type {NavigatorGamepad} from './input/NavigatorGamepad';
export type {NavigatorGamepadEvent} from "./input/NavigatorGamepadEvent"
export type {NavigatorGamepadButton} from "./input/NavigatorGamepadButton"
export type {GamepadConfiguration} from "./input/GamepadConfiguration";
export {Gamepad} from './input/Gamepad';
export {Gamepads} from './input/Gamepads';
export {Buttons} from './input/Buttons';
export {Axes} from './input/Axes';
export {GamepadEvents} from './input/GamepadEvents';
export {Keyboard} from './input/Keyboard';
export * from './input/InputHost';
export * from './input/InputMapper';
export {util as Util};
export * from './util/browser';
export * from './util/detector';
export * from './util/observable';
export * from './util/log';
export * from './util/ArenaPool';
export * from './util/fps';
export * from './util/clock';
export * from './util/WebAudio';
export * from './util/Toaster';
export * from './util/StateMachine';
export * from './util/Future';
export * from './util/Semaphore';
export * from './util/coroutine';
export * from './util/assert';
export * from './util/RentalPool';
export * from './util/PauseSystem';
export * from './util/Serializer';
