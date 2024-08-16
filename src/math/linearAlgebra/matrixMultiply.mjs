import { MatrixND, VectorND, DefaultProcessing } from "../../index.mjs";
/**
 * Matrix multiply. matrix x vector
 * @param {GPUDevice} device 
 * @param {MatrixND} mat1 
 * @param {VectorND} v1 
 * @returns {VectorND}
 */
async function matrixMultiplyMV(device, mat1, v1)
{
    if (mat1.length != v1.length) {
        throw "math/linearAlgebra matrixMultiplyMV() arguments mat1 and mat2 must match dimensions (R^2 to R^4)."
    }
    if (mat1.length < 2) {
        throw "math/linearAlgebra matrixMultiplyMV() arguments mat1 and mat2 must be at least R^2."
    }
    if (mat1.length > 4) {
        throw "math/linearAlgebra matrixMultiplyMV() only supports up to R^4 for arguments mat1 and mat2."
    }
    const maxDimensions = 4
    const dimCount = mat1.length
    const BUFFER_SIZE = 4 * (dimCount)
    
    const mat1_entries = mat1
        .vectors
        .map((v) => {
            let vecSize = v.length
            let vecEntries = v.entries.join(',')

            return `vec${vecSize}f(${vecEntries})`
        })
        .join(',')
    const v1_entries = v1
        .entries
        .join(',')

    const shader = `
    @group(0) @binding(0)
    var <storage, read_write> output: vec${dimCount}f;
    @compute @workgroup_size(64)
    fn main()
    {
        var mat1 : mat${dimCount}x${dimCount}f = mat${dimCount}x${dimCount}f(${mat1_entries});
        var vec1 : vec${dimCount}f = vec${dimCount}f(${v1_entries});
        var result : vec${dimCount}f = mat1 * vec1;
        output = result;
    }
    `

    const processing = new DefaultProcessing(
        device,
        BUFFER_SIZE,
        shader
    )

    const result = await processing.run()
    let newVector = new VectorND(result);

    return newVector
}

/**
 * 
 * @param {GPUDevice} device 
 * @param {VectorND} v1 
 * @param {MatrixND} mat2 
 * @returns {VectorND}
 */
async function matrixMultiplyVM(device, v1, mat1)
{
    if (mat1.length != v1.length) {
        throw "math/linearAlgebra matrixMultiplyMV() arguments mat1 and mat2 must match dimensions (R^2 to R^4)."
    }
    if (mat1.length < 2) {
        throw "math/linearAlgebra matrixMultiplyMV() arguments mat1 and mat2 must be at least R^2."
    }
    if (mat1.length > 4) {
        throw "math/linearAlgebra matrixMultiplyMV() only supports up to R^4 for arguments mat1 and mat2."
    }
    const maxDimensions = 4
    const dimCount = mat1.length
    const BUFFER_SIZE = 4 * (dimCount)
    
    const mat1_entries = mat1
        .vectors
        .map((v) => {
            let vecSize = v.length
            let vecEntries = v.entries.join(',')

            return `vec${vecSize}f(${vecEntries})`
        })
        .join(',')
    const v1_entries = v1
        .entries
        .join(',')

    const shader = `
    @group(0) @binding(0)
    var <storage, read_write> output: vec${dimCount}f;
    @compute @workgroup_size(64)
    fn main()
    {
        var mat1 : mat${dimCount}x${dimCount}f = mat${dimCount}x${dimCount}f(${mat1_entries});
        var vec1 : vec${dimCount}f = vec${dimCount}f(${v1_entries});
        var result : vec${dimCount}f = vec1 * mat1;
        output = result;
    }
    `

    const processing = new DefaultProcessing(
        device,
        BUFFER_SIZE,
        shader
    )

    const result = await processing.run()
    let newVector = new VectorND(result);

    return newVector
}

export {
    matrixMultiplyMV,
    matrixMultiplyVM
}