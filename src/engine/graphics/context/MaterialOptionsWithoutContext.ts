import {MaterialSharedOptions} from "./MaterialSharedOptions";
import {MaterialShaderOptions} from "./MaterialShaderOptions";

/**
 * {@apilink MaterialOptions} without the graphics context, preserving the valid
 * fragmentSource/passes combinations, used by {@apilink MitraGraphicsContextWebgl.createMaterial}
 */
export type MaterialOptionsWithoutContext = MaterialShaderOptions & Omit<MaterialSharedOptions, 'graphicsContext'>;
