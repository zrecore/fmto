import { DefaultShaderAbstract } from "./default-shader-abstract.mjs"

class View3D extends DefaultShaderAbstract
{
    /**
     * Constructor. Setup a default compute processing pipeline.
     * @constructor
     * @param {GPUDevice} device The WebGPU device.
     * @param {GPUTextureView} view Represents a specific view of a GPUTexture.
     * @param {Float32Array} vertices Vertices to draw.
     * @param {number} buffer_size The buffer size to allocate. Note, must be at least 48 bytes.
     * @param {string} shader The WGSL (WebGPU Shading Language) markup to run.
     * @param {string} entry_point Default to "vertex_main" as the entry point function name.
     * @param {string} fragment_entry_point Default to "fragment_main" as fragment shader entry point function name.
     * @param {string} target_format Default to "bgra8unorm". Must match canvas context format configuration.
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

        this._renderPipelineDescriptorConfig = {
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

        this._renderPassDescriptorConfig = {
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
    /**
     * @type {JSON}
     */
    get renderPassDescriptorConfig() {
        return this._renderPassDescriptorConfig
    }
    /**
     * @type {JSON}
     */
    set renderPassDescriptorConfig(value) {
        this._renderPassDescriptorConfig = value
    }
    /**
     * @type {JSON}
     */
    get renderPipelineDescriptorConfig() {
        return this._renderPipelineDescriptorConfig
    }

    /**
     * @type {JSON}
     */
    set renderPipelineDescriptorConfig(value) {
        this._renderPipelineDescriptorConfig = value
    }

    /**
     * @type {GPUTextureView}
     */
    get view()
    {
        return this._view
    }
    /**
     * @type {GPUTextureView}
     */
    set view(value)
    {
        this._view = value
    }
    /**
     * @type {Float32Array}
     */
    get vertices()
    {
        return this._vertices
    }
    /**
     * @type {Float32Array}
     */
    set vertices(values)
    {
        this._vertices = values
    }
    /**
     * @type {Object} RGBA clear color: "r", "g", "b", and "a", where each is a value between 0.0 and 1.0
     */
    get clearColor()
    {
        return this._clearColor
    }
    /**
     * @type {Object} RGBA clear color: "r", "g", "b", and "a", where each is a value between 0.0 and 1.0
     */
    set clearColor(value)
    {
        this._clearColor = this.clearColor
    }
    /**
     * @type {string}
     */
    get targetFormat()
    {
        return this._target_format
    }
    /**
     * @type {string} 
     */
    get fragmentEntryPoint()
    {
        return this._fragment_entry_point
    }
    /**
     * @type {GPURenderPipeline}
     */
    get renderPipeline()
    {
        if (!this._renderPipeline)
        {
            this._renderPipeline = this.device.createRenderPipeline(
                this.renderPipelineDescriptorConfig
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
                    this.renderPassDescriptorConfig
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
    /**
     * 
     */
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
    set vertexBuffer(buffer)
    {
        this._vertex_buffer = buffer
    }
    /**
     * Run the shader module in the render pipeline.
     * Defaults vertexColsPerRow to 7
     *  x, y, z, color r, color g, color b, color a
     * 
     * @param vertexCount Optional. Define how many colums per row are defined per vertex
     */
    async run(vertexCount = 7, useVertexBuffer = true, endEncoder = true, numberOfObjects = 0, drawIndexed = false)
    {
        this.setupShaderModule()

        // Submit the draw operations
        this.passEncoder.setPipeline(this.renderPipeline)

        if (useVertexBuffer) {
            this.passEncoder.setVertexBuffer(0, this.vertexBuffer)

            this.passEncoder.draw(this.vertices.length / vertexCount)
        } else {

            if (numberOfObjects == 0) {
                this.passEncoder.draw(vertexCount)
            } else {
                if (true == drawIndexed) {
                    this.passEncoder.drawIndexed(vertexCount, numberOfObjects)
                } else {
                    this.passEncoder.draw(vertexCount, numberOfObjects)
                }
            }
        }

        if (endEncoder) {
            this.passEncoder.end()

            // ...Submit
            this.device
            .queue
            .submit([
                this.commandEncoder.finish()
            ])
        }
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
    
    
    teardown()
    {
        this._render_buffer = null
        this._vertex_buffer = null
        this._renderPipeline = null
        super.teardown()
    }
}

export {
    View3D
}