import {Actor, CollisionType, Color, easeInOutCubic, Engine, Keys, Loader, PointerScope, vec, Vector} from 'excalibur';
import {TiledResource} from '@excaliburjs/plugin-tiled';

class Player extends Actor {
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

const tiledMap = new TiledResource('./orthogonal-infinite.tmx', {
    useMapBackgroundColor: true,
    entityClassNameFactories: {
        'player-start': (props) => {
            return new Player({
                pos: props.worldPos,
                width: 16,
                height: 16,
                color: Color.Blue,
                collisionType: CollisionType.Active
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

    const x = Math.floor(moveEvent.worldPos.x / 16);
    const y = Math.floor(moveEvent.worldPos.y / 16);
    console.log('coord', x, y);
    const tile = tiledMap.getTilesByCoordinate(x, y)[0]?.exTile;
    const maybeGraphics = tile?.getGraphics();
    if (maybeGraphics && maybeGraphics.length) {
        console.log(maybeGraphics[0]);
    }

})

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

    console.log(-36, -26, tiledMap.getTilesByCoordinate(-36, -26)[0].exTile.getGraphics());
    console.log(-37, -26, tiledMap.getTilesByCoordinate(-37, -26)[0].exTile.getGraphics());

    (window as any).tiledMap = tiledMap;
});
