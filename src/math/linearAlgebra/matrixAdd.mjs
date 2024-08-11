import { MatrixND, VectorND } from "../../index.mjs";

/**
 * 
 * @param {GPUDevice} device 
 * @param {MatrixND} mat1 
 * @param {MatrixND} mat2 
 * @returns {MatrixND}
 */
async function matrixAdd(device, mat1, mat2)
{
    //
    if (mat1.length != mat2.length) {
        throw "math/linearAlgebra matrixAdd() arguments mat1 and mat2 must match dimensions (R^2 to R^4)."
    }
    if (mat1.length < 2) {
        throw "math/linearAlgebra matrixAdd() arguments mat1 and mat2 must be at least R^2."
    }
    if (mat1.length > 4) {
        throw "math/linearAlgebra matrixAdd() only supports up to R^4 for arguments mat1 and mat2."
    }
    const maxDimensions = 4
    const dimCount = mat1.length
    const BUFFER_SIZE = 4 * (dimCount * dimCount + dimCount)
    
    const mat1_entries = mat1
        .vectors
        .map((v) => {
            let vecSize = v.length
            let vecEntries = v.entries.join(',')

            return `vec${vecSize}f(${vecEntries})`
        })
        .join(',')
    const mat2_entries = mat2
        .vectors
        .map((v) => {
            let vecSize = v.length
            let vecEntries = v.entries.join(',')

            return `vec${vecSize}f(${vecEntries})`
        })
        .join(',')

    const shader = `
    @group(0) @binding(0)
    var <storage, read_write> output: mat${dimCount}x${dimCount}<f32>;
    @compute @workgroup_size(64)
    fn main()
    {
        var mat1 : mat${dimCount}x${dimCount}<f32> = mat${dimCount}x${dimCount}<f32>(${mat1_entries});
        var mat2 : mat${dimCount}x${dimCount}<f32> = mat${dimCount}x${dimCount}<f32>(${mat2_entries});
        var matResult : mat${dimCount}x${dimCount}f = mat1 + mat2;
        output = matResult;
    }
    `
    device.pushErrorScope('validation')
    const shaderModule = device.createShaderModule({
        code: shader
    })

    device.popErrorScope().then((error) => {
        if (error)
        {
            throw '/src/math/linearAlgebra/matrixAdd.mjs shader error:' + error.message
        }
    })

    const output = device.createBuffer({
        size: BUFFER_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    })

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
            throw '/src/math/linearAlgebra/matrixAdd.mjs shader error:' + error.message
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
    console.log('result', result)
    let vectors = [];

    // dimCount * dimCount should never be < result.length
    for (let i = 0; i < (dimCount * dimCount); i += (dimCount + (maxDimensions - dimCount)))
    {
        let entries = result.slice(i, i + dimCount)
        vectors.push(new VectorND(entries)) 
    }

    let newMatrix = new MatrixND(vectors);
    return newMatrix

}

export {
    matrixAdd
}