/**
 * FMTO - Linear Algebra library, WebGPU accelerated.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */
import { crossProduct } from './crossProduct.mjs'
import { matrixAdd, matrixSubtract } from './matrix.mjs'

export class LinearAlgebra
{
    constructor( device )
    {
        this._device = device
    }

    get device()
    {
        return this._device
    }
    /**
     * WebGPU fn dot(e1: vecN<T>, e2: vecN<T>) -> T
     * 
     * T is AbstractInt, AbstractFloat, i32, u32, f32, or f16
     * 
     * Returns the dot product of e1 and e2.
     * 
     * See https://webgpufundamentals.org/webgpu/lessons/webgpu-wgsl-function-reference.html
     */
    async dotProduct(e1, e2)
    {
        if (e1.entries.length != e2.entries.length) {
            throw "math/linearAlgebra dotProduct() arguments e1 and e2 must match dimensions."
        }
        if (e1.entries.length < 2) {
            throw "math/linearAlgebra dotProduct() arguments e1 and e2 must be at least 2 dimensional."
        }
        if (e1.entries.length > 4) {
            throw "math/linearAlgebra dotProduct() only supports up to 4 dimensions for arguments e1 and e2."
        }

        const dimCount = e1.entries.length
        const e1_entries = e1.entries.join(', ')
        const e2_entries = e2.entries.join(', ')
        // Create buffer in, buffer out
        // Create shader module to run dot()
        // Run module
        // Return value is a scalar value
        const BUFFER_SIZE = 4
        const shader = `
        @group(0) @binding(0)
        var <storage, read_write> output: f32;
        @compute @workgroup_size(64)
        fn main()
        {
            var e1 : vec${dimCount}f = vec${dimCount}f(${e1_entries});
            var e2 : vec${dimCount}f = vec${dimCount}f(${e2_entries});
            output = dot(e1, e2);
        }
        `
        const shaderModule = this.device.createShaderModule({
            code: shader
        })
        // Create buffers to handle our data
        // ... Specified as storage buffer (high speed).
        // ... Will be the source of a copy operation
        const output = this.device.createBuffer({
            size: BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        })
        // ... Specified as a buffer that can be mapped for reading by JavaScript
        // ... Will be the destination of a copy operation
        const stagingBuffer = this.device.createBuffer({
            size: BUFFER_SIZE,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        })

        // Create a bind group layout
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "storage"
                    }
                }
            ]
        })

        const bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: output
                    }
                }
            ]
        })

        // Create a compute pipeline
        const computePipeline = this.device.createComputePipeline({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    bindGroupLayout
                ]
            }),
            compute: {
                module: shaderModule,
                entryPoint: "main"
            }
        })

        // Run the compute pass

        // ... Create the GPUCommandEncoder to encode commands
        // ... The commands will be issued to the GPU
        const commandEncoder = this.device.createCommandEncoder()
        // ... Initiate compute pass
        const passEncoder = commandEncoder.beginComputePass()

        // (continue running a compute pass)
        passEncoder.setPipeline(computePipeline)
        passEncoder.setBindGroup(0, bindGroup)
        passEncoder.dispatchWorkgroups(Math.ceil(BUFFER_SIZE / 64))

        passEncoder.end()

        commandEncoder.copyBufferToBuffer(
            output,
            0,
            stagingBuffer,
            0,
            BUFFER_SIZE
        )

        // End frame by passing array of command buffers to
        // command queue for execution
        this.device
            .queue
            .submit([
                commandEncoder.finish()
            ])
        
        // Map staging buffer to read results back into JavaScript
        await stagingBuffer.mapAsync(
            GPUMapMode.READ,
            0,              // Offset
            BUFFER_SIZE     // Length
        )

        const copyArrayBuffer = stagingBuffer.getMappedRange(0, BUFFER_SIZE)
        const data = copyArrayBuffer.slice()

        stagingBuffer.unmap()
        const result = new Float32Array(data)

        return result
    }

    /**
     * WebGPU cross()
     */
    async crossProduct(e1, e2)
    {
        return await crossProduct(
            this.device,
            e1,
            e2
        )
    }

    async matrixAdd(mat1, mat2)
    {
        return await matrixAdd(
            this.device,
            mat1,
            mat2
        )
    }
}