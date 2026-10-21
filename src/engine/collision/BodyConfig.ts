import type {DeepRequired} from "../util/DeepRequired.ts";
import {PhysicsConfig} from "./PhysicsConfig";

export type BodyConfig = DeepRequired<Pick<PhysicsConfig, 'bodies'>['bodies']>;