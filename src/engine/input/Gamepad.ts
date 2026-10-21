import type {EventKey, Handler, Subscription} from '../EventEmitter.ts';
import {EventEmitter} from '../EventEmitter.ts';
import {GamepadEvents} from "./GamepadEvents";
import type {NavigatorGamepad} from "./NavigatorGamepad";
import {Axes} from "./Axes";
import {Buttons} from "./Buttons";
import {Gamepads} from "./Gamepads";

/**
 * Gamepad holds state information for a connected controller. See {@apilink Gamepads}
 * for more information on handling controller input.
 */
export class Gamepad {
    public events = new EventEmitter<GamepadEvents>();
    public connected = false;
    public navigatorGamepad!: NavigatorGamepad;
    private _axes: number[] = new Array(4);
    private _buttons: number[] = new Array(16);
    private _buttonsUp: number[] = new Array(16);
    private _buttonsDown: number[] = new Array(16);

    constructor() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i] = 0;
        }
        for (let i = 0; i < this._axes.length; i++) {
            this._axes[i] = 0;
        }
    }

    public update() {
        // Reset buttonsDown and buttonsUp after update is complete
        this._buttonsDown = new Array(16);
        this._buttonsUp = new Array(16);
    }

    /**
     * Tests if a certain button is held down. This is persisted between frames.
     * @param button     The button to query
     * @param threshold  The threshold over which the button is considered to be pressed
     */
    public isButtonHeld(button: Buttons | number, threshold: number = 1) {
        return this._buttons[button] >= threshold;
    }

    /**
     * Tests if a certain button was just pressed this frame. This is cleared at the end of the update frame.
     * @param button Test whether a button was just pressed
     * @param threshold  The threshold over which the button is considered to be pressed
     */
    public wasButtonPressed(button: Buttons | number, threshold: number = 1) {
        return this._buttonsDown[button] >= threshold;
    }

    /**
     * Tests if a certain button was just released this frame. This is cleared at the end of the update frame.
     * @param button  Test whether a button was just released
     */
    public wasButtonReleased(button: Buttons | number) {
        return Boolean(this._buttonsUp[button]);
    }

    /**
     * Gets the given button value between 0 and 1
     */
    public getButton(button: Buttons | number) {
        return this._buttons[button];
    }

    /**
     * Gets the given axis value between -1 and 1. Values below
     * {@apilink MinAxisMoveThreshold} are considered 0.
     */
    public getAxes(axes: Axes | number) {
        const value = this._axes[axes];

        if (Math.abs(value) < Gamepads.MinAxisMoveThreshold) {
            return 0;
        } else {
            return value;
        }
    }

    public updateButton(buttonIndex: number, value: number) {
        // button was just released
        if (value === 0 && this._buttons[buttonIndex]) {
            this._buttonsUp[buttonIndex] = 1;

            // button was just pressed
        } else {
            this._buttonsDown[buttonIndex] = value;
        }

        this._buttons[buttonIndex] = value;
    }

    public updateAxes(axesIndex: number, value: number) {
        this._axes[axesIndex] = value;
    }

    public emit<TEventName extends EventKey<GamepadEvents>>(eventName: TEventName, event: GamepadEvents[TEventName]): void;
    public emit(eventName: string, event?: any): void;
    public emit<TEventName extends EventKey<GamepadEvents> | string>(eventName: TEventName, event?: any): void {
        this.events.emit(eventName, event);
    }

    public on<TEventName extends EventKey<GamepadEvents>>(eventName: TEventName, handler: Handler<GamepadEvents[TEventName]>): Subscription;
    public on(eventName: string, handler: Handler<unknown>): Subscription;
    public on<TEventName extends EventKey<GamepadEvents> | string>(eventName: TEventName, handler: Handler<any>): Subscription {
        return this.events.on(eventName, handler);
    }

    public once<TEventName extends EventKey<GamepadEvents>>(eventName: TEventName, handler: Handler<GamepadEvents[TEventName]>): Subscription;
    public once(eventName: string, handler: Handler<unknown>): Subscription;
    public once<TEventName extends EventKey<GamepadEvents> | string>(eventName: TEventName, handler: Handler<any>): Subscription {
        return this.events.once(eventName, handler);
    }

    public off<TEventName extends EventKey<GamepadEvents>>(eventName: TEventName, handler: Handler<GamepadEvents[TEventName]>): void;
    public off(eventName: string, handler: Handler<unknown>): void;
    public off(eventName: string): void;
    public off<TEventName extends EventKey<GamepadEvents> | string>(eventName: TEventName, handler?: Handler<any>): void {
        this.events.off(eventName, handler as any);
    }
}
