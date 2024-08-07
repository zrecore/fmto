import { MatrixND, VectorND } from "../../index.mjs";

/**
 * 
 * @param {GPUDevice} device 
 * @param {MatrixND} mat1 
 * @param {VectorND} v1 
 * @returns {MatrixND}
 */
async function matrixMultiplyMV(device, mat1, v1)
{
    //
}
/**
 * 
 * @param {GPUDevice} device 
 * @param {VectorND} v1 
 * @param {MatrixND} mat1 
 * @returns {MatrixND}
 */
async function matrixMultiplyVM(device, v1, mat1)
{
    //
}

export {
    matrixMultiplyMV,
    matrixMultiplyVM
}