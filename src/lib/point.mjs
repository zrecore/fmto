class Point2D
{
    constructor(x, y)
    {
        this._x = x
        this._y = y
    }

    get x() { return _x }
    get y() { return _y }

    set x(value) { this._x = value }
    set y(value) { this._y = value }

    *getEntries()
    {
        yield this._x
        yield this._y
    }
}

class Point3D extends Point2D
{
    constructor(x, y, z)
    {
        super(x, y)
        this._z = z
    }

    get z() { return _z }
    set z(value) { this._z = value }

    *getEntries()
    {
        yield this._x
        yield this._y
        yield this._z
    }
}

class Point4D extends Point3D
{
    constructor(x, y, z, w)
    {
        super(x, y, z)
        this._w = w
    }

    get w() { return _w }
    set w(value) { _w = value }

    *getEntries()
    {
        yield this._x
        yield this._y
        yield this._z
        yield this._w
    }
}

export {
    Point2D,
    Point3D,
    Point4D
}