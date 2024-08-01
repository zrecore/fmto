import {
    Vector2D,
    Vector3D,
    Vector4D,
    VectorND
} from './vector.mjs'
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

    toString()
    {
        let value = '[' + this.vectors.map(
            (v) => '[' + v.entries.join(', ') + ']'
        ).join(', ') + ']'
        return value
    }
}

class Matrix2D extends MatrixND
{
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

class Matrix3D extends MatrixND
{
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

class Matrix4D extends MatrixND
{
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