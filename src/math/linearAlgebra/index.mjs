/**
 * FMTO - Linear Algebra library, WebGPU accelerated.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */
import { dotProduct } from './dotProduct.mjs'
import { crossProduct } from './crossProduct.mjs'
import {
    matrixAdd,
    matrixMultiplyMV,
    matrixMultiplyMS,
    matrixMultiplyMM,
    matrixProduct,
    matrixScale,
    matrixSubtract
} from './matrix.mjs'
import { Vector3D } from '../../index.mjs'

class LinearAlgebra
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
        return await dotProduct(
            this.device,
            e1,
            e2
        )
    }

    /**
     * WebGPU cross()
     * The current FMTO implementation only accepts vectors with 3 entries.
     * 
     * @param {Vector3D} e1 
     * @param {Vector3D} e2 
     * @returns 
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

    async matrixSubtract(mat1, mat2)
    {
        return await matrixSubtract(
            this.device,
            mat1,
            mat2
        )
    }
}

export {
    LinearAlgebra,
    dotProduct,
    crossProduct,
    matrixAdd,
    matrixMultiplyMV,
    matrixMultiplyMS,
    matrixMultiplyMM,
    matrixProduct,
    matrixScale,
    matrixSubtract
}