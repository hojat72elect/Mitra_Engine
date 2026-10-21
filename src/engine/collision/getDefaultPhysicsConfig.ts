import type {DeepRequired} from "../util/DeepRequired.ts";
import {vec} from "../math";
import {SolverStrategy} from "./SolverStrategy";
import {SpatialPartitionStrategy} from "./detection/SpatialPartitionStrategy";
import {ContactSolveBias} from "./solver/ContactSolveBias";
import type {PhysicsConfig} from "./PhysicsConfig";

export const getDefaultPhysicsConfig: () => DeepRequired<PhysicsConfig> = () => ({
    enabled: true,
    integration: {
        onScreenOnly: false
    },
    gravity: vec(0, 0).clone(),
    solver: SolverStrategy.Arcade,
    substep: 1,
    colliders: {
        compositeStrategy: 'together'
    },
    continuous: {
        checkForFastBodies: true,
        disableMinimumSpeedForFastBody: false,
        surfaceEpsilon: 0.1
    },
    bodies: {
        canSleepByDefault: true,
        sleepEpsilon: 0.07,
        wakeThreshold: 0.07 * 3,
        sleepBias: 0.5,
        sleepTimeThreshold: 1000,
        defaultMass: 10
    },
    spatialPartition: SpatialPartitionStrategy.SparseHashGrid,
    sparseHashGrid: {
        size: 100
    },
    dynamicTree: {
        boundsPadding: 5,
        velocityMultiplier: 2
    },
    arcade: {
        contactSolveBias: ContactSolveBias.None
    },
    realistic: {
        contactSolveBias: ContactSolveBias.None,
        positionIterations: 3,
        velocityIterations: 8,
        slop: 1,
        steeringFactor: 0.2,
        warmStart: true,
        maxPositionCorrection: -5
    }
});
