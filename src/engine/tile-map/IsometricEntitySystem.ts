import {IsometricEntityComponent} from './IsometricEntityComponent';
import {PauseComponentTag} from "../entity-component-system/components/PauseComponentTag";
import {SystemType} from "../entity-component-system/SystemType";
import {System} from "../entity-component-system/System.ts";
import {SystemPriority} from "../entity-component-system/SystemPriority.ts";
import {TransformComponent} from "../entity-component-system/components/TransformComponent.ts";
import type {Query} from "../entity-component-system/Query.ts";
import type {World} from "../entity-component-system/World.ts";

export class IsometricEntitySystem extends System {
    static override priority: number = SystemPriority.Lower;

    public readonly systemType = SystemType.Update;
    query: Query<typeof TransformComponent | typeof IsometricEntityComponent>;

    constructor(public world: World) {
        super();
        this.query = this.world.query({
            components: {all: [TransformComponent, IsometricEntityComponent]},
            tags: {not: [PauseComponentTag]}
        });
    }

    update(): void {
        let transform: TransformComponent;
        let iso: IsometricEntityComponent;

        for (let i = 0; i < this.query.entities.length; i++) {
            const entity = this.query.entities[i];
            transform = entity.get(TransformComponent);
            iso = entity.get(IsometricEntityComponent);

            const maxZindexPerElevation = Math.max(iso.columns * iso.tileWidth, iso.rows * iso.tileHeight);

            const newZ = maxZindexPerElevation * iso.elevation + transform.pos.y;
            transform.z = newZ;
        }
    }
}
