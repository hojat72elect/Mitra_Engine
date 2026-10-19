import type {BodyComponent} from "./BodyComponent";
import type {CollisionContact} from "./detection/CollisionContact";
import {CollisionType} from "./CollisionType";
import {Island} from "./Island";
import {BodyConfig} from "./BodyConfig";

export function buildContactIslands(config: BodyConfig, bodies: BodyComponent[], contacts: CollisionContact[]): Island[] {
    // Union-find to group connected bodies
    const parent = new Map<BodyComponent, BodyComponent>();

    function find(body: BodyComponent) {
        if (!parent.has(body)) {
            parent.set(body, body);
        }
        if (parent.get(body) !== body) {
            parent.set(body, find(parent.get(body)!)!);
        }
        return parent.get(body);
    }

    function union(bodyA: BodyComponent, bodyB: BodyComponent) {
        const rootA = find(bodyA);
        const rootB = find(bodyB);
        if (rootA !== rootB) {
            parent.set(rootA!, rootB!);
        }
    }

    const bodyToContacts = new Map<BodyComponent, CollisionContact[]>();
    // Connect bodies through contacts
    for (const contact of contacts) {
        if (contact?.bodyA?.collisionType === CollisionType.Active && contact?.bodyB?.collisionType === CollisionType.Active) {
            union(contact.bodyA, contact.bodyB);
        }

        if (!bodyToContacts.has(contact.bodyA!)) {
            bodyToContacts.set(contact.bodyA!, []);
        }

        if (!bodyToContacts.has(contact.bodyB!)) {
            bodyToContacts.set(contact.bodyB!, []);
        }

        if (contact?.bodyA?.collisionType === CollisionType.Active) {
            bodyToContacts.get(contact.bodyA!)!.push(contact);
        }

        if (contact?.bodyB?.collisionType === CollisionType.Active) {
            bodyToContacts.get(contact.bodyB!)!.push(contact);
        }
    }

    // Group bodies by island
    const islandMap = new Map<BodyComponent, BodyComponent[]>();
    for (const body of bodies) {
        if (body.collisionType !== CollisionType.Active) {
            continue;
        }
        const root = find(body);
        if (!islandMap.has(root!)) {
            islandMap.set(root!, []);
        }
        islandMap.get(root!)!.push(body);
    }

    return Array.from(islandMap.values()).map((bodies) => {
        const island = new Island(config);
        island.bodies = bodies;
        bodies.forEach((b) => (b.island = island));
        island.contacts = Array.from(new Set(bodies.flatMap((b) => bodyToContacts.get(b)!)));
        return island;
    });
}
