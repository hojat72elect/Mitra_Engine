import {Component} from '../entity-component-system';
import type {Vector} from '../math';
import {vec} from '../math';

export class ParallaxComponent extends Component {
    // @ts-ignore
    private static _NAME = 'ParallaxComponent';

    parallaxFactor = vec(1.0, 1.0);

    constructor(parallaxFactor?: Vector) {
        super();
        this.parallaxFactor = parallaxFactor ?? this.parallaxFactor;
    }
}
