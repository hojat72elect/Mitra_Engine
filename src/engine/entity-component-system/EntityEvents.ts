import {InitializeEvent, KillEvent, PostUpdateEvent, PreUpdateEvent} from "../events";

/**
 * Built in events supported by all entities
 */
export interface EntityEvents {
    initialize: InitializeEvent;
    //@ts-ignore
    add: AddEvent;
    //@ts-ignore
    remove: RemoveEvent;
    preupdate: PreUpdateEvent;
    postupdate: PostUpdateEvent;
    kill: KillEvent;
}

export const EntityEvents = {
    Add: 'add',
    Remove: 'remove',
    Initialize: 'initialize',
    PreUpdate: 'preupdate',
    PostUpdate: 'postupdate',
    Kill: 'kill'
} as const;
