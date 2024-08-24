import { DefaultShaderAbstract } from "./default-shader-abstract.mjs"

class DefaultRender extends DefaultShaderAbstract
{
    /**
     * Constructor. Setup a default compute processing pipeline.
     * @constructor
     * @param {GPUDevice} device The WebGPU device.
     * @param {GPUTextureView} view Represents a specific view of a GPUTexture
     * @param {Float32Array} vertices Vertices to draw
     * @param {number} buffer_size The buffer size to allocate. Note, must be at least 48 bytes.
     * @param {string} shader The WGSL (WebGPU Shading Language) markup to run.
     * @param {string} entry_point Default to "vertex_main" as the entry point function name.
     * @param {string} fragment_entry_point Default to "fragment_main" as fragment shader entry point function name.
     * @param {Object} clearColor Object representing rgba clear color: "r", "g", "b", and "a", where each is a value between 0.0 and 1.0
     */
    constructor(
        device,
        view,
        vertices,
        buffer_size,
        shader,
        entry_point = "vertex_main",
        fragment_entry_point = "fragment_main",
        target_format = "bgra8unorm",
        clearColor = {
            r: 0.2,
            g: 0.2,
            b: 0.2,
            a: 1.0
        }
    )
    {
        super(device, buffer_size, shader, entry_point)

        this._view = view
        this._vertices = vertices
        this._fragment_entry_point = fragment_entry_point
        this._target_format = target_format
        this._clearColor = clearColor
    }
    get view()
    {
        return this._view
    }
    set view(value)
    {
        this._view = value
    }
    get vertices()
    {
        return this._vertices
    }
    set vertices(values)
    {
        this._vertices = values
    }
    get clearColor()
    {
        return this._clearColor
    }
    set clearColor(value)
    {
        this._clearColor = this.clearColor
    }
    get targetFormat()
    {
        return this._target_format
    }
    get fragmentEntryPoint()
    {
        return this._fragment_entry_point
    }
    get renderBuffer()
    {
        if (!this._render_buffer)
        {
            this._render_buffer = this
                .device
                .createBuffer(
                    this.renderBufferConfig
                )
        }

        return this._render_buffer
    }
    /**
     * @type {GPURenderPipeline}
     */
    get renderPipeline()
    {
        if (!this._renderPipeline)
        {
            this._renderPipeline = this.device.createRenderPipeline(
                this.renderPipelineDescriptorConfig()
            )
        }
        return this._renderPipeline
    }

    /**
     * @type {GPUComputePassEncoder}
     */
    get passEncoder()
    {
        if (!this._passEncoder)
        {
            this
                .device
                .pushErrorScope('validation')

            this._passEncoder = this
                .commandEncoder
                .beginRenderPass(
                    this.renderPassDescriptorConfig()
                )

            this
                .device
                .popErrorScope()
                .then((error) => {
                    if (error)
                    {
                        throw '/src/default/default-render.mjs passEncoder() error:' + error.message
                    }
                })
        }
        return this._passEncoder
    }

    get vertexBuffer()
    {
        if (!this._vertex_buffer)
        {
            this._vertex_buffer = this.device.createBuffer(
                this.renderBufferConfig()
            )

            new Float32Array(
                this._vertex_buffer.getMappedRange()
            )
            .set(
                this.vertices
            )

            // ...relinquish access to the GPU
			this._vertex_buffer.unmap()
        }
        return this._vertex_buffer
    }

    async run()
    {
        this.setupShaderModule()

        // Submit the draw operations
        this.passEncoder.setPipeline(this.renderPipeline)
        this.passEncoder.setVertexBuffer(0, this.vertexBuffer)
        this.passEncoder.draw(4)
        this.passEncoder.end()

        // ...Submit
        this.device
            .queue
            .submit([
                this.commandEncoder.finish()
            ])
    }

    renderBufferConfig()
    {
        return {
            size: this.bufferSize,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        }
    }

    vertexBufferDescriptorConfig()
    {
        return [{
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: "float32x3"
                },
                {
                    shaderLocation: 1,
                    offset: 12,
                    format: "float32x4"
                }
            ],
            arrayStride: 28,
            stepMode: "vertex"
        }]
    }

    renderPipelineDescriptorConfig()
    {
        return {
            vertex: {
                module: this.shaderModule,
                entryPoint: this.entryPoint, // vertex_main
                buffers: this.vertexBufferDescriptorConfig()
            },
            fragment: {
                module: this.shaderModule,
                entryPoint: this.fragmentEntryPoint, // fragment_main
                targets: [
                    {
                        format: this.targetFormat
                    }
                ]
            },
            primitive: {
                topology: "triangle-list"
            },
            layout: "auto"
        }
    }

    renderPassDescriptorConfig()
    {
        return {
            colorAttachments: [
                {
                    loadValue: this.clearColor,
                    loadOp: "clear",
                    storeOp: "store", // tell the GPU to write the results to the view
                    view: this.view
                }
            ]
        }
    }
    
    teardown()
    {
        this._vertex_buffer = null
        this._renderPipeline = null
        super.teardown()
    }
}

export {
    DefaultRender
}