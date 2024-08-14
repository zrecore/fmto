/**
 * FMTO - Linear Algebra library, WebGPU accelerated.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */

import { Vector3D, DefaultProcessing } from "../../index.mjs"

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

    const processing = new DefaultProcessing(
        device,
        BUFFER_SIZE,
        shader
    )

    const result = await processing.run()
    
    return result
}

export {
    crossProduct
}