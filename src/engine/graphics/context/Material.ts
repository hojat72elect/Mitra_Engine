import {Color} from '../../color';
import {MitraGraphicsContextWebgl} from './MitraGraphicsContextWebgl';
import type {Shader} from './Shader';
import type {ImageSource} from '../ImageSource';
import {ImageFiltering} from '../ImageFiltering';
import {Framebuffer} from './Framebuffer';
import {ShaderPipeline} from './shader-pipeline/ShaderPipeline';
import {Glsl} from './Glsl';
import type {ShaderPipelineLike} from "./shader-pipeline/ShaderPipelineLike";
import type {ShaderPassLike} from "./shader-pipeline/ShaderPassLike";
import type {MaterialOptions} from "./MaterialOptions";
import type {UniformDictionary} from "./UniformDictionary";
import {Logger} from "../../util/log.ts";

const defaultVertexSource = `#version 300 es
in vec2 a_position;

in vec2 a_uv;
out vec2 v_uv;

in vec2 a_screenuv;
out vec2 v_screenuv;

uniform mat4 u_matrix;
uniform mat4 u_transform;

void main() {
  // Set the vertex position using the ortho & transform matrix
  gl_Position = u_matrix * u_transform * vec4(a_position, 0.0, 1.0);

  // Pass through the UV coord to the fragment shader
  v_uv = a_uv;
  v_screenuv = a_screenuv;
}
`;

// @ts-ignore
interface MaterialImageOptions {
    filtering?: ImageFiltering;
}

/**
 * Passed to {@apilink Material.update}'s callback for batch-updating a material mid-frame.
 */
interface MaterialContext {
    /**
     * The material's uniforms, the same dictionary as `material.uniforms` changes
     * reach the composite shader and, when `passes` is used, are forwarded to every pass
     */
    uniforms: UniformDictionary;
    /**
     * Every compiled {@apilink Shader} this material drives, in order
     */
    shaders: Shader[];
    /**
     * The same shaders as `shaders`, keyed by {@apilink Shader.name}.
     */
    shadersByName: Map<string, Shader>;
}

/**
 * Composite used when a material provides `passes` but no `fragmentSource`, draws the pipeline
 * output with the graphics context opacity applied
 */
const defaultCompositeFragmentSource = Glsl`
in vec2 v_uv;
uniform sampler2D u_graphic;
uniform float u_opacity;
out vec4 fragColor;
void main() {
  vec4 color = texture(u_graphic, v_uv);
  color.a *= u_opacity;
  fragColor = color;
}`;

export class Material {
    static BuiltInUniforms = [
        'u_time_ms',
        'u_opacity',
        'u_resolution',
        'u_graphic_resolution',
        'u_size',
        'u_matrix',
        'u_transform',
        'u_graphic',
        'u_image',
        'u_original',
        'u_screen_texture'
    ];
    private static _ID = 0;
    /**
     * Unique identifier for this material, useful for debugging and tooling
     */
    public readonly id = Material._ID++;
    private _logger = Logger.getInstance();
    private _shader!: Shader;
    private _initialized = false;
    private _graphicsContext?: MitraGraphicsContextWebgl;
    private _passes?: ShaderPassLike[] | ShaderPipelineLike;
    private _seedFramebuffer?: Framebuffer;
    private _outputFramebuffer?: Framebuffer;

    constructor(options: MaterialOptions) {
        const {color, name, vertexSource, fragmentSource, passes, padding, graphicsContext, images, uniforms} = options;

        if (!fragmentSource && !passes) {
            throw Error(`Material ${name} must be provided a fragmentSource or passes`);
        }

        this._name = name ?? 'anonymous material';
        this._vertexSource = vertexSource ?? defaultVertexSource;
        this._fragmentSource = fragmentSource ?? defaultCompositeFragmentSource;
        this._passes = passes;
        this._padding = padding ?? this._padding;
        this._color = color ?? this._color;
        this._uniforms = uniforms ?? this._uniforms;
        this._images = images ?? this._images;

        if (!graphicsContext) {
            throw Error(`Material ${name} must be provided an Mitra webgl graphics context`);
        }

        if (graphicsContext instanceof MitraGraphicsContextWebgl) {
            this._initialize(graphicsContext);
            graphicsContext.registerMaterial(this);
        } else {
            this._logger.warn(`Material ${name} was created in 2D Canvas mode, currently only WebGL is supported`);
        }

        if (process.env.NODE_ENV === 'development') {
            if (this.images.u_graphic) {
                this._logger.warn(
                    `Material named "${this.name}" is overriding built in image u_graphic, is this on purpose? If so ignore this warning.`
                );
            }

            if (this.images.u_image) {
                this._logger.warn(
                    `Material named "${this.name}" is overriding built in image u_image, is this on purpose? If so ignore this warning.`
                );
            }

            if (this.images.u_screen_texture) {
                this._logger.warn(
                    `Material named "${this.name}" is overriding built in image u_screen_texture, is this on purpose? If so ignore this warning.`
                );
            }

            for (const uniform of Object.keys(this._uniforms)) {
                if (Material.BuiltInUniforms.includes(uniform)) {
                    this._logger.warn(
                        `Material named "${this.name}" is overriding built in uniform ${uniform}, is this on purpose? If so ignore this warning.`
                    );
                }
            }
        }
    }

    private _name: string;

    get name() {
        return this._name;
    }

    private _color: Color = Color.Transparent;

    get color(): Color {
        return this._color;
    }

    set color(c: Color) {
        this._color = c;
    }

    private _fragmentSource: string;

    /**
     * Fragment source this material was created with (before shader compilation)
     */
    get fragmentSource() {
        return this._fragmentSource;
    }

    private _vertexSource: string;

    /**
     * Vertex source this material was created with (before shader compilation)
     */
    get vertexSource() {
        return this._vertexSource;
    }

    private _images: Record<string, ImageSource> = {};

    public get images(): Record<string, ImageSource> {
        return this._shader.images;
    }

    private _uniforms: UniformDictionary = {};

    public get uniforms(): UniformDictionary {
        return this._shader.uniforms;
    }

    private _pipeline?: ShaderPipelineLike;

    /**
     * The multipass pipeline run on the graphic before the composite fragment, if any
     */
    get pipeline(): ShaderPipelineLike | undefined {
        return this._pipeline;
    }

    private _padding: number = 0;

    /**
     * Extra transparent pixels added around the graphic when running the pipeline
     */
    get padding(): number {
        return this._padding;
    }

    get isOverridingGraphic() {
        return !!(this.images.u_graphic || this.images.u_image);
    }

    get isUsingScreenTexture() {
        return !!this._fragmentSource?.includes('u_screen_texture');
    }

    get isUsingOriginalTexture() {
        return !!this.pipeline && !!this._fragmentSource?.includes('u_original');
    }

    /**
     * Lazily creates/resizes the padded framebuffer
     * @internal
     */
    public getSeedFramebuffer(width: number, height: number): Framebuffer {
        if (!this._seedFramebuffer) {
            this._seedFramebuffer = new Framebuffer({
                graphicsContext: this._graphicsContext!,
                width,
                height,
                filtering: ImageFiltering.Blended
            });
        } else {
            this._seedFramebuffer.resize(width, height);
        }
        return this._seedFramebuffer;
    }

    /**
     * Lazily creates/resizes the final output for compositing
     * @internal
     */
    public getOutputFramebuffer(width: number, height: number, filtering?: ImageFiltering): Framebuffer {
        const resolvedFiltering = filtering ?? this._outputFramebuffer?.filtering ?? ImageFiltering.Blended;
        if (this._outputFramebuffer && this._outputFramebuffer.filtering !== resolvedFiltering) {
            this._outputFramebuffer.dispose();
            this._outputFramebuffer = undefined;
        }
        if (!this._outputFramebuffer) {
            this._outputFramebuffer = new Framebuffer({
                graphicsContext: this._graphicsContext!,
                width,
                height,
                filtering: resolvedFiltering
            });
        } else {
            this._outputFramebuffer.resize(width, height);
        }
        return this._outputFramebuffer;
    }

    update(callback: (context: MaterialContext) => any) {
        if (this._shader) {
            const shaders = [this._shader, ...(this._pipeline?.getShaders?.() ?? [])];
            callback({
                uniforms: this.uniforms,
                shaders,
                shadersByName: new Map(shaders.map((shader) => [shader.name, shader]))
            });
        }
    }

    getShader(): Shader | null {
        return this._shader;
    }

    addImageSource(samplerName: string, image: ImageSource) {
        this._shader.addImageSource(samplerName, image);

        if (process.env.NODE_ENV === 'development') {
            if (this.images.u_graphic) {
                this._logger.warn(
                    `Material named "${this.name}" is overriding built in image u_graphic, is this on purpose? If so ignore this warning.`
                );
            }

            if (this.images.u_image) {
                this._logger.warn(
                    `Material named "${this.name}" is overriding built in image u_image, is this on purpose? If so ignore this warning.`
                );
            }

            if (this.images.u_screen_texture) {
                this._logger.warn(
                    `Material named "${this.name}" is overriding built in image u_screen_texture, is this on purpose? If so ignore this warning.`
                );
            }
        }
    }

    removeImageSource(samplerName: string) {
        this._shader.removeImageSource(samplerName);
    }

    use() {
        if (this._initialized) {
            this._shader.use();
            this._shader.trySetUniformFloatColor('u_color', this._color);
        } else {
            throw Error(`Material ${this.name} not yet initialized, use the MitraGraphicsContext.createMaterial() to work around this.`);
        }
    }

    private _initialize(graphicsContextWebGL: MitraGraphicsContextWebgl) {
        if (this._initialized) {
            return;
        }
        this._graphicsContext = graphicsContextWebGL;

        if (this._passes) {
            if (Array.isArray(this._passes)) {
                this._pipeline = new ShaderPipeline({
                    graphicsContext: graphicsContextWebGL,
                    name: this._name,
                    passes: this._passes
                });
            } else {
                this._pipeline = this._passes;
            }
        }

        this._shader = graphicsContextWebGL.createShader({
            name: this._name,
            vertexSource: this._vertexSource,
            fragmentSource: this._fragmentSource,
            uniforms: this._uniforms,
            images: this._images,
            // max texture slots
            // - 1 for the graphic texture (u_graphic/u_image)
            // - +1 if the screen texture is referenced
            // - +1 if the composite references u_original and a pipeline is present (needs its own slot)
            startingTextureSlot: 1 + (this.isUsingScreenTexture ? 1 : 0) + (this.isUsingOriginalTexture ? 1 : 0)
        });
        this._initialized = true;
    }
}
