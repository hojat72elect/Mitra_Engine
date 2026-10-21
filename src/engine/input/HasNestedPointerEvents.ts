import {PointerEventReceiver} from "./PointerEventReceiver";

/**
 * Signals that an object has nested pointer events on nested objects that are not an Entity with
 * a PointerComponent. For example TileMap Tiles
 */
export interface HasNestedPointerEvents {
    _dispatchPointerEvents(receiver: PointerEventReceiver): void;

    _processPointerToObject(receiver: PointerEventReceiver): void;
}
