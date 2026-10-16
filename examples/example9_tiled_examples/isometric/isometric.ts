import {easeInOutCubic, Engine, Flags, Loader, PointerScope, Vector} from 'excalibur';
import {TiledResource} from '@excaliburjs/plugin-tiled';

Flags.useLegacyImageRenderer();
const game = new Engine({
    width: 800,
    height: 600,
    canvasElementId: 'game',
    pointerScope: PointerScope.Canvas,
    antialiasing: false
});
game.toggleDebug();

const tiledMap = new TiledResource('isometric.tmx', {
    useMapBackgroundColor: true
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
