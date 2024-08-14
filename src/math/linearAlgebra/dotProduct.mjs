/**
 * FMTO - Linear Algebra library, WebGPU accelerated.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */

import { DefaultProcessing, Vector2D, Vector3D, Vector4D } from "../../index.mjs"

/**
 * Return the dot product of two vectors.
 * Supports Vector2D, Vector3D, and Vector4D, but both vectors must be of the same dimensions.
 * @param {GPUDevice} device 
 * @param {Vector2D|Vector3D|Vector4D} e1 
 * @param {Vector2D|Vector3D|Vector4D} e2 
 * @returns {number}
 */
async function dotProduct(device, e1, e2)
{
    if (e1.length != e2.length) {
        throw "math/linearAlgebra dotProduct() arguments e1 and e2 must match dimensions."
    }
    if (e1.length < 2) {
        throw "math/linearAlgebra dotProduct() arguments e1 and e2 must be at least 2 dimensional."
    }
    if (e1.length > 4) {
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
    const processing = new DefaultProcessing(
        device,
        BUFFER_SIZE,
        shader
    )

    const result = await processing.run()
    
    return result
}

export { dotProduct }