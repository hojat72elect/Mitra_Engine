import type {DeepRequired} from "../util/required";
import {PhysicsConfig} from "./PhysicsConfig";

export type BodyConfig = DeepRequired<Pick<PhysicsConfig, 'bodies'>['bodies']>;