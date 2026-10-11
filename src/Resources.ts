import {ImageSource, ImageWrapping, Sound} from "excalibur";

export const Resources = {
    // Relative to /public in vite

    // Images
    BirdImage: new ImageSource('./images/bird.png'),
    PipeImage: new ImageSource('./images/pipe.png', {
        wrapping: ImageWrapping.Clamp // Clamp is the default
    }),
    GroundImage: new ImageSource('./images/ground.png', {
        wrapping: ImageWrapping.Repeat
    }),

    // Sounds
    FlapSound: new Sound('./sounds/flap.wav'),
    FailSound: new Sound('./sounds/fail.wav'),
    ScoreSound: new Sound('./sounds/score.wav'),

    // Music
    BackgroundMusic: new Sound('./sounds/two_left_socks.ogg', './sounds/two_left_socks.mp3')
} as const;

