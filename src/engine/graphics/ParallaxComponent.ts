import {vec, Vector} from "../math/Vector.ts";
import {Component} from "../entity-component-system/Component.ts";

export class ParallaxComponent extends Component {
    // @ts-ignore
    private static _NAME = 'ParallaxComponent';

    parallaxFactor = vec(1.0, 1.0);

    constructor(parallaxFactor?: Vector) {
        super();
        this.parallaxFactor = parallaxFactor ?? this.parallaxFactor;
    }
}
