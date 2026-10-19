import type {Engine} from '../engine';
import {Color} from '../color';
import {Rectangle} from '../graphics';
import {Transition} from './Transition';
import {TransitionOptions} from "./TransitionOptions";

interface FadeOptions {
    duration?: number;
    color?: Color;
}

export class FadeInOut extends Transition {
    screenCover!: Rectangle;
    color: Color;

    constructor(options: FadeOptions & TransitionOptions) {
        super({
            ...options,
            duration: options.duration ?? 2000
        });
        this.name = `FadeInOut#${this.id}`;
        this.color = options.color ?? Color.Black;
    }

    public override onInitialize(engine: Engine): void {
        this.transform.pos = engine.screen.unsafeArea.topLeft;
        this.screenCover = new Rectangle({
            width: engine.screen.resolution.width,
            height: engine.screen.resolution.height,
            color: this.color
        });
        this.graphics.add(this.screenCover);
        this.graphics.opacity = this.progress;
    }

    override onReset() {
        this.graphics.opacity = this.progress;
    }

    override onStart(progress: number): void {
        this.graphics.opacity = progress;
    }

    override onEnd(progress: number): void {
        this.graphics.opacity = progress;
    }

    override onUpdate(progress: number): void {
        this.graphics.opacity = progress;
    }
}
