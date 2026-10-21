import type {MitraGraphicsContext} from './context/MitraGraphicsContext';
import type {DebugConfig} from "../debug/DebugConfig";
import {Component} from "../entity-component-system/Component.ts";

/**
 * Provide arbitrary drawing for the purposes of debugging your game
 *
 * Will only show when the Engine is set to debug mode {@apilink Engine.showDebug} or {@apilink Engine.toggleDebug}
 *
 */
export class DebugGraphicsComponent extends Component {
    // @ts-ignore
    private static _NAME = 'DebugGraphicsComponent';

    constructor(
        public draw: (ctx: MitraGraphicsContext, debugFlags: DebugConfig) => void,
        public useTransform = true
    ) {
        super();
    }
}
