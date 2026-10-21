import {GamepadAxisEvent, GamepadButtonEvent, GamepadConnectEvent, GamepadDisconnectEvent} from "../events";

export interface GamepadEvents {
    connect: GamepadConnectEvent;
    disconnect: GamepadDisconnectEvent;
    button: GamepadButtonEvent;
    buttondown: GamepadButtonEvent;
    buttonup: GamepadButtonEvent;
    axis: GamepadAxisEvent;
}

export const GamepadEvents = {
    GamepadConnect: 'connect',
    GamepadDisconnect: 'disconnect',
    GamepadButton: 'button',
    GamepadButtonDown: 'buttondown',
    GamepadButtonUp: 'buttonup',
    GamepadAxis: 'axis'
};