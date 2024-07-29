class VectorND
{
    constructor(entries)
    {
        this._entries = entries
    }
   
    get dimensions()
    {
        if (!this._entries) this._entries = [];
        return this._entries.length
    }

    get x()
    {
        let x = null
        console.log(this._entries)
        if (this._entries != null && this._entries.length > 0)
        {
            x = this._entries[0]
        }

        return x
    }

    set x(value)
    {
        if (!this._entries)
        {
            this._entries = [value]
        } else {
            if (this._entries.length < 1)
            {
                this._entries.push(0)
            }

            this._entries[0] = value
        }
    }

    get y()
    {
        let y = null
        if (this._entries != null && this._entries.length > 1)
        {
            y = this._entries[1]
        }

        return y
    }

    set y(value)
    {
        if (!this._entries)
        {
            this._entries = [0, value]
        } else {
            if (this._entries.length < 2)
            {
                while (this._entries.length < 2)
                {
                    this._entries.push(null)
                }
            }
            this._entries[1] = value;
        }
    }

    get z()
    {
        let z = null
        if (this._entries != null && this._entries.length > 2)
        {
            z = this._entries[2]
        }

        return z
    }
    set z(value)
    {
        if (!this._entries)
        {
            this._entries = [0, 0, value]
        } else {
            if (this._entries.length < 3)
            {
                while (this._entries.length < 3)
                {
                    this._entries.push(null)
                }
            }
            this._entries[2] = value;
        }
    }
    get w()
    {
        let w = null
        if (this._entries != null && this._entries.length > 3)
        {
            w = this._entries[3]
        }

        return w
    }

    set w(value)
    {
        if (!this._entries)
        {
            this._entries = [0, 0, 0, value]
        } else {
            if (this._entries.length < 4)
            {
                while (this._entries.length < 4)
                {
                    this._entries.push(null)
                }
            }
            this._entries[3] = value;
        }
    }

    entryAt(index)
    {
        let value = null
        if (this._entries != null && this._entries[index] != null)
        {
            value = this._entries[index]
        }
        return value
    }
    *getXY()
    {
        yield this.x
        yield this.y
    }
    *getXYZ()
    {
        yield this.x
        yield this.y
        yield this.z
    }
    *getXYZW()
    {
        yield this.x
        yield this.y
        yield this.z
        yield this.w
    }
}

class Vector2D extends VectorND
{
    constructor(x, y)
    {
        super([x, y])
    }

    *getEntries()
    {
        yield this.x
        yield this.y
    }
}

class Vector3D extends VectorND
{
    constructor(x, y, z)
    {
        super([x, y, z])
    }

    *getEntries()
    {
        yield this._x
        yield this._y
        yield this._z
    }
}

class Vector4D extends VectorND
{
    constructor(x, y, z, w)
    {
        super([x, y, z, w])
    }

    *getEntries()
    {
        yield this._x
        yield this._y
        yield this._z
        yield this._w
    }
}

export {
    VectorND,
    Vector2D,
    Vector3D,
    Vector4D
}