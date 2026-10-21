import type {Entity} from "../../entity-component-system/Entity.ts";

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
