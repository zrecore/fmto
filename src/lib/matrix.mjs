/**
 * FMTO - WebGPU accelerated math library.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */

import {
    Vector2D,
    Vector3D,
    Vector4D,
    VectorND
} from './vector.mjs'

/**
 * Matrix n x n, or m x n class representation.
 */
class MatrixND
{
    /**
     * Instantiate Matrix with vector array. 
     * Vectors are of type VectorND, Vector2D, Vector3D, or Vector4D
     * @param {VectorND[]} vectors 
     */
    constructor(vectors)
    {
        this._vectors = vectors
    }

    get vectors()
    {
        return this._vectors
    }

    get length()
    {
        return this._vectors.length
    }

    toString()
    {
        let value = '[' + this.vectors.map(
            (v) => '[' + v.entries.join(', ') + ']'
        ).join(', ') + ']'
        return value
    }
}
/**
 * Matrix 2D class representation, extends MatrixND.
 */
class Matrix2D extends MatrixND
{
    /**
     * Construct a 2 x 2 Matrix.
     * Defaults missing vectors and vector entries to 0. 
     * @param {Vector2D} vec1 
     * @param {Vector2D} vec2 
     */
    constructor(vec1, vec2)
    {
        let dim = 2;
        let vectors = [vec1, vec2]

        for (let i = 0; i < vectors.length; i++)
        {
            if (!vectors[i]) vectors[i] = new Vector2D(0.0, 0.0)
            if (vectors[i].length < dim)
            {
                for (let j = vectors[i].length; j < dim; j++)
                {
                    vectors[i].entries.push(0.0)
                }
            }
            if (vectors[i].length != dim) throw `Matrix vector at index ${i} is not R^${dim}.`
        }
        super(vectors)
    }
}
/**
 * Matrix 3D class representation, extends MatrixND.
 */
class Matrix3D extends MatrixND
{
    /**
     * Construct a 3 x 3 matrix.
     * @param {Vector3D} vec1 
     * @param {Vector3D} vec2 
     * @param {Vector3D} vec3 
     */
    constructor(vec1, vec2, vec3)
    {
        
        let dim = 3;
        let vectors = [vec1, vec2, vec3]
        for (let i = 0; i < vectors.length; i++)
        {
            if (!vectors[i]) vectors[i] = new Vector3D(0.0, 0.0, 0.0)
            if (vectors[i].length < dim)
            {
                for (let j = vectors[i].length; j < dim; j++)
                {
                    vectors[i].entries.push(0.0)
                }
            }
            if (vectors[i].length != dim) throw `Matrix vector at index ${i} is not R^${dim}.`
        }
        
        super(vectors)
    }
}
/**
 * Matrix 4D class representation, extends MatrixND
 */
class Matrix4D extends MatrixND
{
    /**
     * Construct a 4 x 4 matrix.
     * @param {Vector4D} vec1 
     * @param {Vector4D} vec2 
     * @param {Vector4D} vec3 
     * @param {Vector4D} vec4 
     */
    constructor(vec1, vec2, vec3, vec4)
    {
        let dim = 4;
        let vectors = [vec1, vec2, vec3, vec4]
        for (let i = 0; i < vectors.length; i++)
        {
            if (!vectors[i]) vectors[i] = new Vector4D(0.0, 0.0, 0.0, 0.0)
            if (vectors[i].length < dim)
            {
                for (let j = vectors[i].length; j < dim; j++)
                {
                    vectors[i].entries.push(0.0)
                }
            }
            if (vectors[i].length != dim) throw `Matrix vector at index ${i} is not R^${dim}.`
        }
        super(vectors)
    }
}

export {
    MatrixND,
    Matrix2D,
    Matrix3D,
    Matrix4D
}