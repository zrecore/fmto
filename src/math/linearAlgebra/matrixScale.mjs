import { MatrixND, VectorND, DefaultCompute } from "../../index.mjs";
/**
 * Component-wise scaling of a matrix using a scalar.
 * 
 * @param {GPUDevice} device 
 * @param {MatrixND} mat1 
 * @param {number} scalar1 
 * @returns {MatrixND}
 */
async function matrixScale(device, mat1, scalar1)
{
    if (mat1.length < 2) {
        throw "math/linearAlgebra matrixScale() arguments mat1 must be at least R^2."
    }
    if (mat1.length > 4) {
        throw "math/linearAlgebra matrixScale() only supports up to R^4 for arguments mat1."
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
    

    const shader = `
    @group(0) @binding(0)
    var <storage, read_write> output: mat${dimCount}x${dimCount}<f32>;
    @compute @workgroup_size(64)
    fn main()
    {
        var mat1 : mat${dimCount}x${dimCount}<f32> = mat${dimCount}x${dimCount}<f32>(${mat1_entries});
        var scalar1 : f32 = ${scalar1};
        var matResult : mat${dimCount}x${dimCount}f = mat1 * scalar1;
        output = matResult;
    }
    `

    const processing = new DefaultCompute(
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
    matrixScale
}