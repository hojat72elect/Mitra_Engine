import {BoundingBox} from "../BoundingBox";
import {HashGridProxy} from "./HashGridProxy";

/**
 * Grid coordinates within this bound pack into a single safe-integer number for fast Map lookups;
 * coordinates outside it (an extremely large or spread out world) fall back to a BigInt key.
 */
const HASH_GRID_KEY_BOUND = 1 << 20;
const HASH_GRID_KEY_RANGE = HASH_GRID_KEY_BOUND * 2;

export class HashGridCell<TObject extends {
    bounds: BoundingBox
}, TProxy extends HashGridProxy<TObject> = HashGridProxy<TObject>> {
    proxies: TProxy[] = [];
    key!: number | bigint;
    x!: number;
    y!: number;

    static calculateHashKey(x: number, y: number): number | bigint {
        if (x >= -HASH_GRID_KEY_BOUND && x <= HASH_GRID_KEY_BOUND && y >= -HASH_GRID_KEY_BOUND && y <= HASH_GRID_KEY_BOUND) {
            return (x + HASH_GRID_KEY_BOUND) * HASH_GRID_KEY_RANGE + (y + HASH_GRID_KEY_BOUND);
        }
        return BigInt(x) * BigInt(4294967296) + BigInt(y);
    }

    configure(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.key = HashGridCell.calculateHashKey(x, y);
    }
}