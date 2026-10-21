import type {Actor} from '../actor';
import {GameEvent} from '../';
import type {Sound} from "../resources/sound/sound.ts";

export class MediaEvent extends GameEvent<Sound> {
    constructor(
        public override target: Sound,
        protected _name: string = 'MediaEvent'
    ) {
        super();
    }

    /**
     * Media event cannot bubble
     */
    public override get bubbles(): boolean {
        return false;
    }

    /**
     * Media event cannot bubble
     */
    public override set bubbles(_value: boolean) {
        // stubbed
    }

    /**
     * Media event cannot bubble, so they have no path
     */
    protected get _path(): Actor[] {
        return [];
    }

    /**
     * Media event cannot bubble, so they have no path
     */
    protected set _path(_val: Actor[]) {
        // stubbed
    }

    /**
     * Prevents event from bubbling
     */
    public override stopPropagation(): void {
        /**
         * Stub
         */
    }

    /**
     * Action, that calls when event happens
     */
    public action(): void {
        /**
         * Stub
         */
    }

    /**
     * Propagate event further through event path
     */
    public propagate(): void {
        /**
         * Stub
         */
    }

    public layPath(_actor: Actor): void {
        /**
         * Stub
         */
    }
}
