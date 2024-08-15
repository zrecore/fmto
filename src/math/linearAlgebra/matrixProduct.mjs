import { MatrixND, VectorND, DefaultProcessing } from "../../index.mjs";
/**
 * 
 * @param {GPUDevice} device 
 * @param {MatrixND} mat1 
 * @param {MatrixND} mat2 
 * @returns {MatrixND}
 */
async function matrixProduct(device, mat1, mat2)
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
        var matResult : mat${dimCount}x${dimCount}f = mat1 * mat2;
        output = matResult;
    }
    `

    const processing = new DefaultProcessing(
        device,
        BUFFER_SIZE,
        shader
    )

    const result = await processing.run()
    
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
    matrixProduct
}