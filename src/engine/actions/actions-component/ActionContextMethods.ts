import {ActionContext} from "../ActionContext";

export interface ActionContextMethods extends Pick<ActionContext, keyof ActionContext> {
}