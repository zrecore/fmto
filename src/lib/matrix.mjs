class MatrixND
{
    constructor(rows)
    {
        this._rows = rows
    }

    get rows()
    {
        if (!this._rows)
        {
            this._rows = [[0.0, 0.0], [0.0, 0.0]]
        }
        return this._rows
    }

    toString()
    {
        let value = '[' + this.rows.map((r) => '[' + r.join(', ') + ']').join(', ') + ']'
        return value
    }
}

class Matrix2D extends MatrixND
{
    constructor(row1, row2)
    {
        if (!row1 && !row2)
        {
            row1 = [0.0, 0.0]
            row2 = [0.0, 0.0]
        }
        if (!row1 && row2)
        {
            row1 = []
            for (var i = 0; i < row2.length; i++)
            {
                row1.push(0.0)
            }
        }

        if (row1 && !row2)
        {
            row2 = []
            for (var i = 0; i < row1.length; i++)
            {
                row2.push(0.0)
            }
        }
        super([row1, row2])
    }
}

class Matrix3D extends MatrixND
{
    constructor(row1, row2, row3)
    {
        super([row1, row2, row3])
    }
}

class Matrix4D extends MatrixND
{
    constructor(row1, row2, row3, row4)
    {
        super([row1, row2, row3, row4])
    }
}

export {
    MatrixND,
    Matrix2D,
    Matrix3D,
    Matrix4D
}