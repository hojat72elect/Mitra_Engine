import {ImageSource, ImageWrapping, Sound} from "excalibur";

export const Resources = {
    // Relative to /public in vite

    // Images
    BirdImage: new ImageSource('./example1_flappy_bird/images/bird.png'),
    PipeImage: new ImageSource('./example1_flappy_bird/images/pipe.png', {
        wrapping: ImageWrapping.Clamp // Clamp is the default
    }),
    GroundImage: new ImageSource('./example1_flappy_bird/images/ground.png', {
        wrapping: ImageWrapping.Repeat
    }),

    // Sounds
    FlapSound: new Sound('./example1_flappy_bird/sounds/flap.wav'),
    FailSound: new Sound('./example1_flappy_bird/sounds/fail.wav'),
    ScoreSound: new Sound('./example1_flappy_bird/sounds/score.wav'),

    // Music
    BackgroundMusic: new Sound('./example1_flappy_bird/sounds/two_left_socks.ogg', './example1_flappy_bird/sounds/two_left_socks.mp3')
} as const;

