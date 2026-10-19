import {Entity} from "../../entity-component-system";

/**
 * Used for implementing actions for the {@apilink ActionContext | `Action API`}.
 */
export interface Action {
    id: number;

    update(elapsed: number): void;

    isComplete(entity: Entity): boolean;

    reset(): void;

    stop(): void;
}
