class Vector2D
{
    constructor(x, y)
    {
        this._x = x
        this._y = y
    }

    get x() { return this._x }
    get y() { return this._y }

    set x(value) { this._x = value }
    set y(value) { this._y = value }

    *getEntries()
    {
        yield this._x
        yield this._y
    }
}

class Vector3D extends Vector2D
{
    constructor(x, y, z)
    {
        super(x, y)
        this._z = z
    }

    get z() { return this._z }
    set z(value) { this._z = value }

    *getEntries()
    {
        yield this._x
        yield this._y
        yield this._z
    }
}

class Vector4D extends Vector3D
{
    constructor(x, y, z, w)
    {
        super(x, y, z)
        this._w = w
    }

    get w() { return this._w }
    set w(value) { this._w = value }

    *getEntries()
    {
        yield this._x
        yield this._y
        yield this._z
        yield this._w
    }
}

export {
    Vector2D,
    Vector3D,
    Vector4D
}