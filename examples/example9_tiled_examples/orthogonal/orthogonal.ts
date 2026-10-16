import {Actor,
    type ActorArgs, CollisionGroup, CollisionType, Color, easeInOutCubic, Engine, Keys, Loader, PointerScope, vec, Vector} from 'excalibur';
import {TiledResource} from '@excaliburjs/plugin-tiled';

class Player extends Actor {
    constructor(args: ActorArgs) {
        super(args);
    }

    override onPostUpdate(engine: Engine) {
        this.vel = vec(0, 0)
        const speed = 64;
        if (engine.input.keyboard.isHeld(Keys.Right)) {
            this.vel.x = speed;
        }
        if (engine.input.keyboard.isHeld(Keys.Left)) {
            this.vel.x = -speed;
        }
        if (game.input.keyboard.isHeld(Keys.Up)) {
            this.vel.y = -speed;
        }
        if (game.input.keyboard.isHeld(Keys.Down)) {
            this.vel.y = speed;
        }
    }
}

const game = new Engine({
    width: 800,
    height: 600,
    canvasElementId: 'game',
    pointerScope: PointerScope.Canvas,
    antialiasing: false
});
game.toggleDebug();

const tiledMap = new TiledResource('./orthogonal.tmx', {
    useMapBackgroundColor: true,
    layerConfig: {
        "Above": {
            useTileCollidersWhenInvisible: true,
            collisionGroup: new CollisionGroup("above", 0x01, 0x00111)
        }
    },
    entityClassNameFactories: {
        'player-start': (props) => {
            return new Player({
                pos: props.worldPos,
                width: 16,
                height: 16,
                color: Color.Blue,
                collisionType: CollisionType.Active,
                collisionGroup: new CollisionGroup("player", 0x10, 0x00010)
            });
        }
    }
});

const loader = new Loader([tiledMap]);

let currentPointer!: Vector;
game.input.pointers.primary.on('down', (moveEvent) => {
    currentPointer = moveEvent.worldPos;
    game.currentScene.camera.move(currentPointer, 300, easeInOutCubic);
});

game.input.pointers.primary.on('move', (moveEvent) => {
    const tile = tiledMap.getTileByPoint('ground', moveEvent.worldPos);
    if (tile) {
        console.log(tile);
    }
})
let frame = 0;
game.on('preframe', () => console.log('frame:', frame++));

game.input.pointers.primary.on('wheel', (wheelEvent) => {
    // wheel up
    game.currentScene.camera.pos = currentPointer;
    if (wheelEvent.deltaY < 0) {
        game.currentScene.camera.zoom *= 1.2;
    } else {
        game.currentScene.camera.zoom /= 1.2;
    }
});

game.start(loader).then(() => {
    tiledMap.addToScene(game.currentScene);
    currentPointer = game.currentScene.camera.pos;

    (window as any).tiledMap = tiledMap;
});
