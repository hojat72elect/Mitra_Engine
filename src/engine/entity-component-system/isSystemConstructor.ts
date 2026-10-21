import type {SystemCtor} from "./SystemCtor";
import {System} from "./System";

export function isSystemConstructor(x: any): x is SystemCtor<System> {
    return !!x?.prototype && !!x?.prototype?.constructor?.name;
}
