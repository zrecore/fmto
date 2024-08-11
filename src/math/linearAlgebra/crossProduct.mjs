/**
 * FMTO - Linear Algebra library, WebGPU accelerated.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */

import { Vector3D } from "../../index.mjs"

/**
 * 
 * @param {GPUDevice} device 
 * @param {Vector3D} e1 
 * @param {Vector3D} e2 
 * @returns 
 */
async function crossProduct(device, e1, e2)
{
    if (e1.length != e2.length) {
        throw "math/linearAlgebra crossProduct() arguments e1 and e2 must match dimensions."
    }
    if (e1.length < 3) {
        throw "math/linearAlgebra crossProduct() arguments e1 and e2 must be at least 3 dimensional."
    }
    if (e1.length > 3) {
        throw "math/linearAlgebra crossProduct() only supports up to 3 dimensions for arguments e1 and e2."
    }

    const dimCount = e1.length
    const e1_entries = e1.entries.join(', ')
    const e2_entries = e2.entries.join(', ')

    const BUFFER_SIZE = 4 * dimCount // x is 4, y is 4, z is 4
    const shader = `
    @group(0) @binding(0)
    var <storage, read_write> output: vec${dimCount}f;
    @compute @workgroup_size(64)
    fn main()
    {
        var e1 : vec${dimCount}f = vec${dimCount}f(${e1_entries});
        var e2 : vec${dimCount}f = vec${dimCount}f(${e2_entries});
        output = cross(e1, e2);
    }
    `
    const shaderModule = device.createShaderModule({
        code: shader
    })
    // Create buffers to handle our data
    // ... Specified as storage buffer (high speed).
    // ... Will be the source of a copy operation
    const output = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    })
    // ... Specified as a buffer that can be mapped for reading by JavaScript
    // ... Will be the destination of a copy operation
    const stagingBuffer = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    })

    // Create a bind group layout
    const bindGroupLayout = device.createBindGroupLayout({
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

    const bindGroup = device.createBindGroup({
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
    const computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
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
    const commandEncoder = device.createCommandEncoder()
    // ... Initiate compute pass
    device.pushErrorScope('validation')
    const passEncoder = commandEncoder.beginComputePass()

    // (continue running a compute pass)
    passEncoder.setPipeline(computePipeline)
    passEncoder.setBindGroup(0, bindGroup)
    passEncoder.dispatchWorkgroups(Math.ceil(BUFFER_SIZE / 64))

    passEncoder.end()

    device.popErrorScope().then((error) => {
        if (error)
        {
            throw 'src/math/linearAlgebra/crossProduct.mjs shader error:' + error.message
        }
    })

    commandEncoder.copyBufferToBuffer(
        output,
        0,
        stagingBuffer,
        0,
        BUFFER_SIZE
    )

    // End frame by passing array of command buffers to
    // command queue for execution
    device
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

export {
    crossProduct
}