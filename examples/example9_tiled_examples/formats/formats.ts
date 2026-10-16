import {
    Actor,
    CollisionType,
    Color,
    easeInOutCubic,
    Engine,
    ImageFiltering,
    ImageSource,
    IsometricEntityComponent,
    Keys,
    Loader,
    PointerScope,
    Shape,
    vec,
    Vector
} from 'excalibur';
import {TiledResource} from '@excaliburjs/plugin-tiled';

const game = new Engine({
    width: 800,
    height: 600,
    canvasElementId: 'game',
    pointerScope: PointerScope.Canvas,
    antialiasing: false
});

game.input.keyboard.on("press", (evt) => {
    if (evt.key === Keys.D) {
        game.toggleDebug();
    }
});

let currentPointer!: Vector;
game.input.pointers.primary.on('down', (moveEvent) => {
    currentPointer = moveEvent.worldPos;
    game.currentScene.camera.move(currentPointer, 300, easeInOutCubic);
});

game.input.pointers.primary.on('wheel', (wheelEvent) => {
    // wheel up
    game.currentScene.camera.pos = currentPointer;
    if (wheelEvent.deltaY < 0) {
        game.currentScene.camera.zoom *= 1.2;
    } else {
        game.currentScene.camera.zoom /= 1.2;
    }
});

const reset = () => {
    game.stop();
    game.currentScene.camera.clearAllStrategies();
    game.currentScene.camera.zoom = 1;
    game.currentScene.tileMaps.forEach(t => {
        game.currentScene.remove(t);
    });
    game.currentScene.entities.forEach(a => {
        game.currentScene.remove(a);
    });
    game.currentScene.clear();
    game.start();
}

const start = (mapFile: string) => {
    const isIsometric = mapFile === 'example-isometric.tmx';
    let player = new Actor({
        pos: vec(100, 100),
        width: 16,
        height: 16,
        color: Color.Blue,
        collisionType: CollisionType.Active
    });
    (window as any).player = player;
    (window as any).game = game;
    player.on('collisionstart', () => {
        console.log('entered an area');
    });
    player.on('collisionend', () => {
        console.log('left an area');
    });

    game.currentScene.camera.strategy.elasticToActor(player, .8, .9);

    player.onPostUpdate = () => {
        player.vel.setTo(0, 0);
        const speed = isIsometric ? 64 * 2 : 64;
        if (game.input.keyboard.isHeld(Keys.Right)) {
            player.vel.x = speed;
            if (isIsometric) {
                player.vel.y = speed;
            }
        }
        if (game.input.keyboard.isHeld(Keys.Left)) {
            player.vel.x = -speed;
            if (isIsometric) {
                player.vel.y = -speed;
            }
        }
        if (game.input.keyboard.isHeld(Keys.Up)) {
            player.vel.y = -speed;
            if (isIsometric) {
                player.vel.x = speed;
            }
        }
        if (game.input.keyboard.isHeld(Keys.Down)) {
            player.vel.y = speed;
            if (isIsometric) {
                player.vel.x = -speed;
            }
        }
    }
    game.add(player);

    const map = new TiledResource(mapFile, {
        startZIndex: -2
    });
    (window as any).tiledMap = map;
    const playercube = new ImageSource('./player-cube.png', true, ImageFiltering.Blended);
    const loader = new Loader([map, playercube]);

    (window as any).map = map;
    game.start(loader).then(() => {

        game.input.pointers.primary.on('down', evt => {
            const tile = map.getTileByPoint('Ground', evt.worldPos);
        });

        player.pos = vec(100, 100);
        if (isIsometric) {
            player.graphics.use(playercube.toSprite());
            player.collider.set(Shape.Polygon([
                vec(0, 94.9975),
                vec(55.0546, -32.6446 + 94.9975),
                vec(110.639, -0.352914 + 94.9975),
                vec(55.584, 31.7623 + 94.9975)
            ].map(p => p.sub(vec(111 / 2, 64)))));

            const playerlevel = map.getIsoTileLayers('playerlevel')[0];
            const iso = new IsometricEntityComponent(playerlevel.isometricMap);
            iso.elevation = playerlevel.isometricMap.elevation;
            player.addComponent(iso);
        }
        const start = map.getObjectsByName('player-start')[0];
        if (start) {
            player.pos.x = start.x;
            player.pos.y = start.y;
            console.log("player start", start.x, start.y);
        }

        // Camera init bug :( forcing a hack
        setTimeout(() => {
            game.currentScene.camera.x = player.pos.x;
            game.currentScene.camera.y = player.pos.y;
            game.currentScene.camera.zoom = 4;
            if (isIsometric) {
                game.currentScene.camera.zoom = 1;
                player.pos.x = 100;
                player.pos.y = 200;
            }
        });
        map.addToScene(game.currentScene);
        currentPointer = game.currentScene.camera.pos;
    });
}

const selectMapEl = document.getElementById('select-map') as HTMLSelectElement;
selectMapEl.addEventListener('change', (e) => {
    let map = (e.target as HTMLSelectElement).value;

    if (map) {
        reset();
        window.location.hash = map;
        start(map);
    }

    return true;
})

window.onload = function () {
    let map = window.location.hash.slice(1) ?? '';
    if (map) {
        console.log(map);
        let options = Array.from(selectMapEl.options);
        let index = options.findIndex(o => o.value === map);
        if (index > -1) {
            selectMapEl.selectedIndex = index;
            start(map);
        }
    } else {
        window.location.hash = "example-city.tmx";
        selectMapEl.selectedIndex = 0;
        start("example-city.tmx");
    }
}