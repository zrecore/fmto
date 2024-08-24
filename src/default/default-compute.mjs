import { DefaultShaderAbstract } from "./default-shader-abstract.mjs"

class DefaultCompute extends DefaultShaderAbstract
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
        super(device, buffer_size, shader, entry_point)
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
                    this.bindGroupLayoutConfig()
                )
        }
        return this._bindGroupLayout
    }
    /**
     * @type {GPUBindGroupLayout}
     */
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
                this.createBindGroupConfig()
            )
        }
        return this._bindGroup
    }
    /**
     * @type {GPUBindGroup}
     */
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
     * Specific to a compute shader setup.
     * @type {GPUComputePipeline}
     */
    get computePipeline()
    {
        if (!this._computePipeline)
        {
            this
                .device
                .pushErrorScope('validation')

            const computePipelineConfig = this.createComputePipelineConfig()

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
                        throw '/src/default/default-compute.mjs computePipeline() error:' + error.message
                    }
                })
        }
        return this._computePipeline
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
                        throw '/src/default/default-compute.mjs passEncoder() error:' + error.message
                    }
                })
        }
        return this._passEncoder
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
                    throw '/src/default/default-compute.mjs run() error, device.queue.submit(), commandEncoder.finish():' + error.message
                }
            })
        
        // Map staging buffer to read results back into JavaScript
        await this.stagingBuffer.mapAsync(
            GPUMapMode.READ,
            0,                  // Offset
            this.bufferSize     // Length
        )

        const copyArrayBuffer = this
            .stagingBuffer
            .getMappedRange(0, this.bufferSize)
        
        const data = copyArrayBuffer.slice()
        
        this
            .stagingBuffer
            .unmap()
        
        const result = new Float32Array(data)

        return result
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
            // mappedAtCreation: false // Default is false
        }
    }

    bindGroupLayoutConfig () {
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

    createBindGroupConfig ()
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

    createComputePipelineConfig ()
    {
        return {
            layout: this.pipelineLayout,
            compute: {
                module: this.shaderModule,
                entryPoint: this.entryPoint
            }
        }
    }

    teardown()
    {
        super.teardown()
        this._outputBuffer = null
        this._stagingbuffer = null
        this._computePipeline = null
    }
}

export {
    DefaultCompute
}