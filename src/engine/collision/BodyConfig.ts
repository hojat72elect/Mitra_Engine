import type {DeepRequired} from "../util/DeepRequired.ts";
import type {PhysicsConfig} from "./PhysicsConfig";

export type BodyConfig = DeepRequired<Pick<PhysicsConfig, 'bodies'>['bodies']>;