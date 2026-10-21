import {ColorBlindFlags} from './ColorBlindFlags';
import type {Engine} from '../engine';
import {Color} from '../color';
import type {StandardClock, TestClock} from '../util/clock';
import {Debug} from '../graphics';
import {FrameStats} from "./FrameStats";
import type {DebugStats} from "./DebugStats";

/**
 * Debug statistics and flags for Mitra. If polling these values, it would be
 * best to do so on the `postupdate` event for {@apilink Engine}, after all values have been
 * updated during a frame.
 */
export class DebugConfig {
    /**
     * Performance statistics
     */
    public stats: DebugStats = {
        /**
         * Current frame statistics. Engine reuses this instance, use {@apilink FrameStats.clone} to copy frame stats.
         * Best accessed on {@apilink postframe} event. See {@apilink FrameStats}
         */
        currFrame: new FrameStats(),

        /**
         * Previous frame statistics. Engine reuses this instance, use {@apilink FrameStats.clone} to copy frame stats.
         * Best accessed on {@apilink preframe} event. Best inspected on engine event `preframe`. See {@apilink FrameStats}
         */
        prevFrame: new FrameStats()
    };
    public settings = {
        text: {
            foreground: Color.Black,
            background: Color.Transparent,
            border: Color.Transparent
        },
        z: {
            text: Number.POSITIVE_INFINITY,
            point: Number.MAX_SAFE_INTEGER - 1,
            ray: Number.MAX_SAFE_INTEGER - 1,
            dashed: Number.MAX_SAFE_INTEGER - 2,
            solid: Number.MAX_SAFE_INTEGER - 3
        }
    };
    /**
     * Correct or simulate color blindness using {@apilink ColorBlindnessPostProcessor}.
     * @warning Will reduce FPS.
     */
    public colorBlindMode: ColorBlindFlags;
    /**
     * Filter debug context to named entities or entity ids
     */
    public filter: { useFilter: boolean; nameQuery: string; ids: number[] } = {
        /**
         * Toggle filter on or off (default off) must be on for DebugDraw to use filters
         */
        useFilter: false,
        /**
         * Query for entities by name, if the entity name contains `nameQuery` it will be included
         */
        nameQuery: '',
        /**
         * Query for Entity ids, if the id matches it will be included
         */
        ids: []
    };
    /**
     * Entity debug settings
     */
    public entity = {
        showAll: false,
        showId: false,
        showName: false
    };
    /**
     * Transform component debug settings
     */
    public transform = {
        showAll: false,

        showPosition: false,
        showPositionLabel: false,
        positionColor: Color.Yellow,

        showZIndex: false,

        showScale: false,
        scaleColor: Color.Green,

        showRotation: false,
        rotationColor: Color.Blue
    };
    /**
     * Graphics component debug settings
     */
    public graphics = {
        showAll: false,

        showBounds: false,
        boundsColor: Color.Yellow
    };
    /**
     * Collider component debug settings
     */
    public collider = {
        showAll: false,

        showBounds: false,
        boundsColor: Color.Blue,

        showOwner: false,

        showGeometry: true,
        geometryColor: Color.Green,
        geometryLineWidth: 2,
        geometryPointSize: 2
    };
    /**
     * Physics simulation debug settings
     */
    public physics = {
        showAll: false,

        showBroadphaseSpacePartitionDebug: false,

        showCollisionNormals: false,
        collisionNormalColor: Color.Cyan,

        showCollisionContacts: true,
        contactSize: 10,
        collisionContactColor: Color.Red
    };
    /**
     * Motion component debug settings
     */
    public motion = {
        showAll: false,

        showVelocity: false,
        velocityColor: Color.Yellow,

        showAcceleration: false,
        accelerationColor: Color.Red
    };
    /**
     * Body component debug settings
     */
    public body = {
        showAll: false,

        showCollisionGroup: false,
        showCollisionType: false,
        showSleeping: false,
        showMotion: false,
        showMass: false
    };
    /**
     * Camera debug settings
     */
    public camera = {
        showAll: false,

        showFocus: false,
        focusColor: Color.Red,

        showZoom: false
    };
    public tilemap = {
        showAll: false,

        showGrid: false,
        gridColor: Color.Red,
        gridWidth: 0.5,
        showSolidBounds: false,
        solidBoundsColor: Color.fromHex('#8080807F'), // grayish
        showColliderGeometry: true
    };
    public isometric = {
        showAll: false,
        showPosition: false,
        positionColor: Color.Yellow,
        positionSize: 1,
        showGrid: false,
        gridColor: Color.Red,
        gridWidth: 1,
        showColliderGeometry: true
    };
    /**
     * Screen debug settings
     *
     * Visualizes the screen-space coordinate plan, including the safe {@apilink Screen.contentArea}
     * and the full {@apilink Screen.unsafeArea} (which may be partially offscreen under the
     * *AndFill display modes).
     */
    public screen = {
        showAll: false,

        showContentArea: true,
        contentAreaColor: Color.Green,

        showUnsafeArea: true,
        unsafeAreaColor: Color.Red,

        showLegend: true,
        legendColor: Color.White
    };
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;

        this.colorBlindMode = new ColorBlindFlags(this._engine);

        Debug.registerDebugConfig(this);
    }

    /**
     * Switch the current Mitra clock with the {@apilink TestClock} and return
     * it in the same running state.
     *
     * This is useful when you need to debug frame by frame.
     */
    public useTestClock(): TestClock {
        const clock = this._engine.clock;
        const wasRunning = clock.isRunning();
        clock.stop();

        const testClock = clock.toTestClock();
        if (wasRunning) {
            testClock.start();
        }
        this._engine.clock = testClock;
        return testClock;
    }

    /**
     * Switch the current Mitra clock with the {@apilink StandardClock} and
     * return it in the same running state.
     *
     * This is useful when you need to switch back to normal mode after
     * debugging.
     */
    public useStandardClock(): StandardClock {
        const currentClock = this._engine.clock;
        const wasRunning = currentClock.isRunning();
        currentClock.stop();

        const standardClock = currentClock.toStandardClock();
        if (wasRunning) {
            standardClock.start();
        }
        this._engine.clock = standardClock;
        return standardClock;
    }
}
