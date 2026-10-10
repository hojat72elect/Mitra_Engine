import {Color, DisplayMode, Engine} from "excalibur";

const flappyBirdGame = new Engine({
    width: 400,
    height: 500,
    backgroundColor: Color.fromHex("#54C0CA"),
    pixelArt: true,
    pixelRatio: 2,
    displayMode: DisplayMode.FitScreen
});

flappyBirdGame.start();
