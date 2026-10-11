import {Engine, Color, DisplayMode, Loader, vec} from 'excalibur';
import {Resources} from './Resources.ts';
import {Level} from './Level.ts';
import {initMuteButton} from './Ui.ts';

const positionUI = (game: Engine) => {
    const ui = document.getElementsByClassName("ui")[0] as HTMLElement;
    if (ui) {
        const topLeft = game.screen.screenToPageCoordinates(vec(10, 500 - 40));
        ui.style.visibility = 'visible';
        ui.style.left = topLeft.x + 'px';
        ui.style.top = topLeft.y + 'px';
    }
}

const game = new Engine({
    width: 400,
    height: 500,
    backgroundColor: Color.fromHex("#54C0CA"),
    pixelArt: true,
    pixelRatio: 2,
    displayMode: DisplayMode.FitScreen,
    scenes: {Level}
});

const loader = new Loader(Object.values(Resources));

game.start(loader).then(() => {
    game.goToScene('Level');
    positionUI(game);
    initMuteButton();
});

game.screen.events.on('resize', () => positionUI(game));
