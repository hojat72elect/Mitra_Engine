/**
 * The current Mitra version string
 * @description `process.env.__EX_VERSION` gets replaced by Webpack on build
 */
export const EX_VERSION = typeof process !== 'undefined' ? process.env.__EX_VERSION : undefined;
import {polyfill} from './polyfill';
// Events namespace
import * as events from './events';
// ex.Util namespaces

polyfill();

export {events as Events};

