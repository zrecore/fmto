/**
 * FMTO - Linear Algebra library, WebGPU accelerated.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */
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
    async dotProduct3(e1, e2)
    {
        // @TODO create buffer in, buffer out
        // @TODO create shader module to run dot()
        // @TODO run module
        // @TODO return value
        const BUFFER_SIZE = 4
        const shader = `
        @group(0) @binding(0)
        var <storage, read_write> output: f32;
        @compute @workgroup_size(64)
        fn main()
        {
            var e1 : vec3f = vec3f(${e1.x}, ${e1.y}, ${e1.z});
            var e2 : vec3f = vec3f(${e2.x}, ${e2.y}, ${e2.z});
            output = dot(e1, e2);
        }
        `
        const shaderModule = this.device.createShaderModule({
            code: 
            // `
            // @group(0) @binding(0)
            // var<storage, read_write> output: array<f32>;

            // @compute @workgroup_size(64)
            // fn main(
            //     @builtin(global_invocation_id)
            //     global_id : vec3u,

            //     @builtin(local_invocation_id)
            //     local_id: vec3u
            // ) {
            //     // Avoid accessing the buffer out of bounds
            //     if (global_id.x >= ${BUFFER_SIZE}u)
            //     {
            //         return;
            //     }
            //     // This actually does the 'calculation'
            //     output[global_id.x] = 
            //         f32(global_id.x) * 1000. 
            //         + f32(local_id.x);
            // }
            // `
            shader
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

        console.log(result)

        return result
    }

    /**
     * WebGPU cross()
     */
    crossProduct3()
    {

    }
}