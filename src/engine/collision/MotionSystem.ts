import type {Entity, Query, World} from '../entity-component-system';
import {SystemPriority} from '../entity-component-system';
import {MotionComponent} from '../entity-component-system';
import {TransformComponent} from '../entity-component-system';
import {System} from '../entity-component-system';
import {BodyComponent} from './BodyComponent';
import {CollisionType} from './CollisionType';
import {EulerIntegrator} from './EulerIntegrator';
import type {PhysicsWorld} from './PhysicsWorld';
import {PauseComponentTag} from "../entity-component-system/components/PauseComponentTag";
import {SystemType} from "../entity-component-system/SystemType";

export class MotionSystem extends System {
    static override priority = SystemPriority.Higher;

    public systemType = SystemType.Update;
    query: Query<typeof TransformComponent | typeof MotionComponent>;
    private _physicsConfigDirty = false;

    constructor(
        public world: World,
        public physics: PhysicsWorld
    ) {
        super();
        this.query = this._createPhysicsQuery(world, physics);
        physics.$configUpdate.subscribe(() => {
            this._physicsConfigDirty = true;
        });
    }

    update(elapsed: number): void {
        let transform: TransformComponent;
        let motion: MotionComponent;
        const entities = this.query.entities;
        const config = this.physics.config;
        const substep = config.substep;

        for (let i = 0; i < entities.length; i++) {
            transform = entities[i].get(TransformComponent);
            motion = entities[i].get(MotionComponent);

            if (motion.integration.onScreenOnly && entities[i].hasTag('ex.offscreen')) {
                continue;
            }

            const optionalBody = entities[i].get(BodyComponent);
            if (this._physicsConfigDirty && optionalBody) {
                optionalBody.updatePhysicsConfig(this.physics.config.bodies);
            }

            if (optionalBody?.isSleeping) {
                continue;
            }

            const totalAcc = motion.acc.clone();
            if (optionalBody?.collisionType === CollisionType.Active && optionalBody?.useGravity) {
                totalAcc.addEqual(this.physics.config.gravity);
            }

            // capture old transform of this entity and all of its children so that
            // any transform properties that derived from their parents are properly captured
            if (!entities[i].parent) {
                this.captureOldTransformWithChildren(entities[i]);
            }

            // Update transform and motion based on Euler linear algebra
            EulerIntegrator.integrate(transform, motion, totalAcc, elapsed / substep);
        }
        if (this._physicsConfigDirty) {
            this._physicsConfigDirty = false;
            this.query = this._createPhysicsQuery(this.world, this.physics);
        }
    }

    captureOldTransformWithChildren(entity: Entity) {
        entity.get(BodyComponent)?.captureOldTransform();

        for (let i = 0; i < entity.children.length; i++) {
            this.captureOldTransformWithChildren(entity.children[i]);
        }
    }

    private _createPhysicsQuery(world: World, physics: PhysicsWorld) {
        return world.query({
            components: {
                all: [TransformComponent, MotionComponent]
            },
            tags: {
                not: physics.config.integration.onScreenOnly
                    ? ['ex.offscreen', 'ex.is_sleeping', PauseComponentTag]
                    : ['ex.is_sleeping', PauseComponentTag]
            }
        });
    }
}
