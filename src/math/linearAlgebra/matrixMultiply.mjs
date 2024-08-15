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
 * @param {MatrixND} mat1 
 * @param {number} s1 
 * @returns {MatrixND}
 */
async function matrixMultiplyMS(device, mat1, s1)
{
    //
}

/**
 * 
 * @param {GPUDevice} device 
 * @param {MatrixND} mat1 
 * @param {MatrixND} mat2 
 * @returns {MatrixND}
 */
async function matrixMultiplyMM(device, v1, mat1)
{
    //
}

export {
    matrixMultiplyMV,
    matrixMultiplyMS,
    matrixMultiplyMM
}