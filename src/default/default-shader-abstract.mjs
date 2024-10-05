class DefaultShaderAbstract
{
    /**
     * Constructor. Setup a default compute processing pipeline.
     * @constructor
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
    set shader(value) {
        this._shader = value
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
                    throw '/src/default/default-shader-abstract.mjs setupShaderModule() error:' + error.message
                }
            })
    }

    teardown()
    {
        this._bindGroupLayout = null
        this._bindGroup = null
        this._pipelineLayout = null
        
        this._commandEncoder = null
        this._passEncoder = null
        this._shaderModule = null
    }
    /**
     * Run the shader module
     * @abstract
     */
    run() {}
}

export {
    DefaultShaderAbstract
}