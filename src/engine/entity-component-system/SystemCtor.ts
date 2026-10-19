import {System} from "./System";

export interface SystemCtor<T extends System> {
    new(...args: any[]): T;
}
