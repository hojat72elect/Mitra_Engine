import {Color} from '../../color';
import type {MitraGraphicsContext} from '../../graphics';

import {RentalPool} from '../../util/RentalPool.ts';
import {BoundingBox} from '../BoundingBox';
import {HashGridProxy} from "./HashGridProxy";
import {HashGridCell} from "./HashGridCell";
import type {Vector} from "../../math/Vector.ts";

export class SparseHashGrid<TObject extends {
    bounds: BoundingBox
}, TProxy extends HashGridProxy<TObject> = HashGridProxy<TObject>> {
    readonly gridSize: number;
    readonly sparseHashGrid: Map<number | bigint, HashGridCell<TObject, TProxy>>;
    readonly objectToProxy: Map<TObject, TProxy>;

    public bounds = new BoundingBox();

    private _hashGridCellPool = new RentalPool<HashGridCell<TObject, TProxy>>(
        () => new HashGridCell(),
        (instance) => {
            instance.configure(0, 0);
            instance.proxies.length = 0;
            return instance;
        },
        1000
    );

    private _buildProxy: (object: TObject) => TProxy;

    constructor(options: { size: number; proxyFactory?: (object: TObject, gridSize: number) => TProxy }) {
        this.gridSize = options.size;
        this.sparseHashGrid = new Map<number | bigint, HashGridCell<TObject, TProxy>>();
        this.objectToProxy = new Map<TObject, TProxy>();
        if (options.proxyFactory) {
            this._buildProxy = (object: TObject) => options.proxyFactory!(object, this.gridSize);
        } else {
            this._buildProxy = (object: TObject) => new HashGridProxy(object, this.gridSize) as TProxy;
        }

        // TODO dynamic grid size potentially larger than the largest collider
        // TODO Re-hash the objects if the median proves to be different
    }

    query(point: Vector): TObject[];
    query(bounds: BoundingBox): TObject[];
    query(boundsOrPoint: BoundingBox | Vector): TObject[] {
        const results = new Set<TObject>();
        if (boundsOrPoint instanceof BoundingBox) {
            const bounds = boundsOrPoint;
            const leftX = Math.floor(bounds.left / this.gridSize);
            const rightX = Math.floor(bounds.right / this.gridSize);
            const bottomY = Math.floor(bounds.bottom / this.gridSize);
            const topY = Math.floor(bounds.top / this.gridSize);
            for (let x = leftX; x <= rightX; x++) {
                for (let y = topY; y <= bottomY; y++) {
                    const key = HashGridCell.calculateHashKey(x, y);
                    // Hash bounds into appropriate cell
                    const cell = this.sparseHashGrid.get(key);
                    if (cell) {
                        for (let i = 0; i < cell.proxies.length; i++) {
                            cell.proxies[i].updateBounds();
                            if (cell.proxies[i].bounds.intersect(bounds)) {
                                results.add(cell.proxies[i].object);
                            }
                        }
                    }
                }
            }
        } else {
            const point = boundsOrPoint;
            const key = HashGridCell.calculateHashKey(Math.floor(point.x / this.gridSize), Math.floor(point.y / this.gridSize));
            // Hash points into appropriate cell
            const cell = this.sparseHashGrid.get(key);
            if (cell) {
                for (let i = 0; i < cell.proxies.length; i++) {
                    cell.proxies[i].updateBounds();
                    if (cell.proxies[i].bounds.contains(point)) {
                        results.add(cell.proxies[i].object);
                    }
                }
            }
        }
        return Array.from(results);
    }

    get(xCoord: number, yCoord: number): HashGridCell<TObject> {
        const key = HashGridCell.calculateHashKey(xCoord, yCoord);
        const cell = this.sparseHashGrid.get(key)!;
        return cell;
    }

    /**
     * **WARNING** TObjects must use the same coordPlan on their .bounds to work properly
     */
    track(target: TObject): void {
        const proxy = this._buildProxy(target);
        this.objectToProxy.set(target, proxy);
        for (let x = proxy.leftX; x <= proxy.rightX; x++) {
            for (let y = proxy.topY; y <= proxy.bottomY; y++) {
                this._insert(x, y, proxy);
            }
        }
    }

    untrack(target: TObject): void {
        const proxy = this.objectToProxy.get(target);
        if (proxy) {
            proxy.clear();
            this.objectToProxy.delete(target);
        }
    }

    update(targets: TObject[]): number {
        let updated = 0;
        // FIXME resetting bounds is wrong, if nothing has updated then
        // the bounds stay 0
        // this.bounds.reset();
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            const proxy = this.objectToProxy.get(target);
            if (!proxy) {
                continue;
            }
            // hasChanged refreshes proxy.bounds when needed, the broadphase reads them directly
            if (proxy.hasChanged()) {
                // TODO slightly wasteful only remove from changed
                for (let x = proxy.leftX; x <= proxy.rightX; x++) {
                    for (let y = proxy.topY; y <= proxy.bottomY; y++) {
                        this._remove(x, y, proxy);
                    }
                }
                proxy.update();
                // TODO slightly wasteful only add new
                for (let x = proxy.leftX; x <= proxy.rightX; x++) {
                    for (let y = proxy.topY; y <= proxy.bottomY; y++) {
                        this._insert(x, y, proxy);
                    }
                }
                updated++;
            }
        }
        return updated;
    }

    debug(ex: MitraGraphicsContext, elapsed: number): void {
        const color = Color.White;
        for (const cell of this.sparseHashGrid.values()) {
            ex.debug.drawRect(cell.x * this.gridSize, cell.y * this.gridSize, this.gridSize, this.gridSize, {
                color,
                lineWidth: 2
            });
        }
    }

    private _insert(x: number, y: number, proxy: TProxy): void {
        const key = HashGridCell.calculateHashKey(x, y);
        // Hash collider into appropriate cell
        let cell = this.sparseHashGrid.get(key);
        if (!cell) {
            cell = this._hashGridCellPool.rent();
            cell.configure(x, y);
            this.sparseHashGrid.set(cell.key, cell);
        }
        cell.proxies.push(proxy);
        proxy.cells.push(cell); // TODO dupes, doesn't seem to be a problem
        this.bounds.combine(proxy.bounds, this.bounds);
    }

    private _remove(x: number, y: number, proxy: TProxy): void {
        const key = HashGridCell.calculateHashKey(x, y);
        // Hash collider into appropriate cell
        const cell = this.sparseHashGrid.get(key);
        if (cell) {
            // swap-remove, membership order doesn't matter (pair order comes from proxy insertion order)
            const proxies = cell.proxies;
            const proxyIndex = proxies.indexOf(proxy);
            if (proxyIndex > -1) {
                proxies[proxyIndex] = proxies[proxies.length - 1];
                proxies.pop();
            }
            const cells = proxy.cells;
            const cellIndex = cells.indexOf(cell);
            if (cellIndex > -1) {
                cells[cellIndex] = cells[cells.length - 1];
                cells.pop();
            }
            if (cell.proxies.length === 0) {
                this._hashGridCellPool.return(cell);
                this.sparseHashGrid.delete(key);
            }
        }
    }
}
