import type {BodyConfig} from "./BodyConfig";
import type {BodyComponent} from "./BodyComponent";
import type {CollisionContact} from "./detection/CollisionContact";

export class Island {
    bodies: BodyComponent[] = [];
    contacts: CollisionContact[] = [];
    isSleeping = false;

    constructor(public config: BodyConfig) {
    }

    wake() {
        this.isSleeping = false;
        for (const body of this.bodies) {
            body.wake();
        }
    }

    sleep() {
        this.isSleeping = true;
        for (const body of this.bodies) {
            body.sleep();
        }
    }

    updateSleepState(elapsed: number) {
        let islandHasMotion = false;
        let allBodiesCanSleep = true;
        let anyAwake = false;
        let anySleeping = false;

        for (const body of this.bodies) {
            body.updateMotion(elapsed);

            if (!body.canFallAsleep) {
                allBodiesCanSleep &&= false;
            }
            if (body.canWakeUp) {
                islandHasMotion ||= true;
            }
            if (body.isSleeping) {
                anySleeping = true;
            } else {
                anyAwake = true;
            }
        }

        // Wake entire island if ANY body has motion, or if the island is only partially asleep.
        // Bodies in an island share a sleep state, mixed islands would let awake bodies push into
        // sleeping (never integrated) bodies
        if (islandHasMotion || (anyAwake && anySleeping)) {
            this.wake();

            // Put entire island to sleep if ALL bodies are below threshold
        } else if (allBodiesCanSleep) {
            let minSleepTime = Infinity;
            for (const body of this.bodies) {
                minSleepTime = Math.min(minSleepTime, body.sleepTime);
            }

            // Only sleep if the ENTIRE island has been still long enough
            if (minSleepTime > this!.config!.sleepTimeThreshold) {
                this.sleep();
            }
        }
    }
}
