class DefaultProcessing
{
    /**
     * Constructor. Setup a default compute processing pipeline.
     * @param {GPUDevice} device The WebGPU device.
     * @param {number} buffer_size The buffer size to allocate. Note, must be at least 48 bytes.
     * @param {string} shader The WGSL (WebGPU Shading Language) markup to run.
     * @param {string} entry_point Default to "main" as the entry point function name.
     */
    constructor(device, buffer_size, shader, entry_point = "main")
    {
        this._device = device
        this._buffer_size = buffer_size
        
        this._shader = shader
        this._entry_point = entry_point
        // Reset stuff
        this.teardown()
    }
    /**
     * @type {GPUDevice}
     */
    get device()
    {
        return this._device
    }
    /**
     * @type {number}
     */
    get bufferSize()
    {
        return this._buffer_size
    }
    /**
     * @type {string}
     */
    get entryPoint()
    {
        return this._entry_point
    }
    /**
     * @type {string}
     */
    get shader()
    {
        return this._shader
    }
    /**
     * @type {GPUBuffer}
     */
    get outputBuffer()
    {
        if (!this._outputBuffer)
        {
            this._outputBuffer = this
                .device
                .createBuffer(
                    this.outputBufferConfig()
                )
        }
        return this._outputBuffer
    }
    /**
     * @type {GPUBuffer}
     */
    get stagingBuffer()
    {
        if (!this._stagingBuffer)
        {
            this._stagingBuffer = this
                .device
                .createBuffer(
                    this.stagingBufferConfig()
                )
        }
        return this._stagingBuffer
    }
    /**
     * @type {GPUBindGroupLayout}
     */
    get bindGroupLayout()
    {
        if (!this._bindGroupLayout)
        {
            this._bindGroupLayout = this
                .device
                .createBindGroupLayout(
                    this.bindGroupLayoutMake()
                )
        }
        return this._bindGroupLayout
    }
    set bindGroupLayout(value)
    {
        this._bindGroupLayout = value
    }
    /**
     * @type {GPUBindGroup}
     */
    get bindGroup()
    {
        if (!this._bindGroup)
        {
            this._bindGroup = this.device.createBindGroup(
                this.createBindGroup()
            )
        }
        return this._bindGroup
    }
    set bindGroup(value)
    {
        this._bindGroup = value
    }
    /**
     * @type {GPUPipelineLayout}
     */
    get pipelineLayout()
    {
        if (!this._pipelineLayout)
        {
            this._pipelineLayout = this
                .device
                .createPipelineLayout({
                    bindGroupLayouts: [
                        this.bindGroupLayout
                    ]
                })
        }
        return this._pipelineLayout
    }
    /**
     * @type {GPUComputePipeline}
     */
    get computePipeline()
    {
        if (!this._computePipeline)
        {
            this
                .device
                .pushErrorScope('validation')

            const computePipelineConfig = this.createComputePipeline()

            this._computePipeline = this
                .device
                .createComputePipeline(
                    computePipelineConfig
                )
            this
                .device
                .popErrorScope()
                .then((error) => {
                    if (error)
                    {
                        throw '/src/default/default-processing.mjs computePipeline() error:' + error.message
                    }
                })
        }
        return this._computePipeline
    }
    /**
     * @type {GPUCommandEncoder}
     */
    get commandEncoder()
    {
        if (!this._commandEncoder)
        {
            this._commandEncoder = this
                .device
                .createCommandEncoder()
        }
        return this._commandEncoder
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
                .beginComputePass()

            this
                .device
                .popErrorScope()
                .then((error) => {
                    if (error)
                    {
                        throw '/src/default/default-processing.mjs passEncoder() error:' + error.message
                    }
                })
        }
        return this._passEncoder
    }
    /**
     * @type {string}
     */
    get shader()
    {
        return this._shader
    }
    /**
     * @type {GPUShaderModule}
     */
    get shaderModule()
    {
        if (!this._shaderModule)
        {
            this.setupShaderModule()
        }
        return this._shaderModule
    }

    setupShaderModule()
    {
        this
            .device
            .pushErrorScope('validation')
        
        this._shaderModule = this
            .device
            .createShaderModule({
                code: this.shader
            })

        this
            .device
            .popErrorScope()
            .then((error) => {
                if (error)
                {
                    throw '/src/default/default-processing.mjs setupShaderModule() error:' + error.message
                }
            })
    }
    /**
     * Run the shader module in the compute processing pipeline
     * @returns {Float32Array}
     */
    async run()
    {
        this.setupShaderModule()

        // Run the shader module
        // return Float32Array
        this.passEncoder.setPipeline(this.computePipeline)
        this.passEncoder.setBindGroup(0, this.bindGroup)
        this.passEncoder.dispatchWorkgroups(
            Math.ceil(this.bufferSize / 64) // X
        )

        this.passEncoder.end()

        this.commandEncoder.copyBufferToBuffer(
            this.outputBuffer,
            0,
            this.stagingBuffer,
            0,
            this.bufferSize
        )

        this
            .device
            .pushErrorScope('validation')

        this
            .device
            .queue
            .submit([
                this
                    .commandEncoder
                    .finish()
            ])
        this
            .device
            .popErrorScope()
            .then((error) => {
                if (error)
                {
                    throw '/src/default/default-processing.mjs run() error, device.queue.submit(), commandEncoder.finish():' + error.message
                }
            })
        
        // Map staging buffer to read results back into JavaScript
        await this.stagingBuffer.mapAsync(
            GPUMapMode.READ,
            0,                  // Offset
            this.bufferSize     // Length
        )

        const copyArrayBuffer = this.stagingBuffer.getMappedRange(0, this.bufferSize)
        const data = copyArrayBuffer.slice()
        
        this.stagingBuffer.unmap()
        const result = new Float32Array(data)

        return result
    }

    teardown()
    {
        this._outputBuffer = null
        this._stagingbuffer = null
        this._bindGroupLayout = null
        this._bindGroup = null
        this._pipelineLayout = null
        this._computePipeline = null
        this._commandEncoder = null
        this._passEncoder = null
        this._shaderModule = null
    }

    outputBufferConfig () {
        return {
            size: this.bufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        }
    }

    stagingBufferConfig () {
        return {
            size: this.bufferSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        }
    }

    bindGroupLayoutMake () {
        return {
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "storage"
                    }
                }
            ]
        }
    }

    createBindGroup ()
    {
        return {
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.outputBuffer
                    }
                }
            ]
        }
    }

    createComputePipeline ()
    {
        return {
            layout: this.pipelineLayout,
            compute: {
                module: this.shaderModule,
                entryPoint: this.entryPoint
            }
        }
    }


}

export {
    DefaultProcessing
}