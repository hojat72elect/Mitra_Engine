import {BoundingBox} from "../BoundingBox";
import {HashGridCell} from "./HashGridCell";


export class HashGridProxy<T extends { bounds: BoundingBox }> {
    id: number = -1;
    /**
     * left bounds x hash coordinate
     */
    leftX: number;
    /**
     * right bounds x hash coordinate
     */
    rightX: number;
    /**
     * bottom bounds y hash coordinate
     */
    bottomY: number;
    /**
     * top bounds y hash coordinate
     */
    topY: number;

    bounds: BoundingBox;

    cells: HashGridCell<T>[] = [];
    hasZeroBounds = false;
    /**
     * Grid size in pixels
     */
    readonly gridSize: number;

    constructor(
        public object: T,
        gridSize: number
    ) {
        this.gridSize = gridSize;
        this.bounds = object.bounds;
        this.hasZeroBounds = this.bounds.hasZeroDimensions();
        this.leftX = Math.floor(this.bounds.left / this.gridSize);
        this.rightX = Math.floor(this.bounds.right / this.gridSize);
        this.bottomY = Math.floor(this.bounds.bottom / this.gridSize);
        this.topY = Math.floor(this.bounds.top / this.gridSize);
    }

    /**
     * Has the hashed bounds changed
     *
     * Refreshes `bounds` as a side effect (via {@apilink updateBounds}) so callers that need the current
     * bounds regardless of the result (see {@apilink SparseHashGrid.update}) don't have to recompute them
     */
    hasChanged(): boolean {
        this.updateBounds();
        const bounds = this.bounds;
        const leftX = Math.floor(bounds.left / this.gridSize);
        const rightX = Math.floor(bounds.right / this.gridSize);
        const bottomY = Math.floor(bounds.bottom / this.gridSize);
        const topY = Math.floor(bounds.top / this.gridSize);
        if (this.leftX !== leftX || this.rightX !== rightX || this.bottomY !== bottomY || this.topY !== topY) {
            return true;
        }
        return false;
    }

    /**
     * Clears all collider references
     */
    clear(): void {
        for (const cell of this.cells) {
            const index = cell.proxies.indexOf(this);
            if (index > -1) {
                cell.proxies.splice(index, 1);
            }
            // TODO reclaim cell in pool if empty?
        }
    }

    /**
     * Update bounds of the proxy
     */
    updateBounds(): void {
        this.bounds = this.object.bounds;
    }

    /**
     * Updates the hashed bounds coordinates
     *
     * Only called after {@apilink hasChanged} returns true, which has already refreshed `bounds`
     */
    update(): void {
        this.leftX = Math.floor(this.bounds.left / this.gridSize);
        this.rightX = Math.floor(this.bounds.right / this.gridSize);
        this.bottomY = Math.floor(this.bounds.bottom / this.gridSize);
        this.topY = Math.floor(this.bounds.top / this.gridSize);
        this.hasZeroBounds = this.bounds.hasZeroDimensions();
    }
}