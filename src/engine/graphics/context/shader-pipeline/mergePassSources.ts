import {ShaderPassSource} from "./ShaderPassSource";

/**
 * Adds `extra` sources onto `sources` without clobbering the pass's own reserved names
 * @internal
 */
export function mergePassSources(
    sources: Record<string, ShaderPassSource>,
    extra?: Record<string, ShaderPassSource>
): Record<string, ShaderPassSource> {
    if (extra) {
        for (const [name, source] of Object.entries(extra)) {
            if (!(name in sources)) {
                sources[name] = source;
            }
        }
    }
    return sources;
}
