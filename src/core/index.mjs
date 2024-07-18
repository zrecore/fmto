/**
 * FMTO - Core
 */
class Core
{
    static _adapter = null
    static _device = null

    constructor() {}

    async initializeAdapter()
    {
        if (!navigator.gpu)
        {
            return false
        }

        this.adapter = await navigator.gpu.requestAdapter()

        if (!this.adapter)
        {
            return false
        }

        return true
    }

    async initializeDevice()
    {
        if (!this._adapter)
        {
            if (!this.initializeAdapter())
            {
                return false
            }
        }

        this._device = await this.adapter.requestDevice()

        return true
    }

    get adapter()
    {
        return this._adapter
    }

    set adapter(a)
    {
        this._adapter = a
    }

    get device()
    {
        return this._device
    }

    set device(d)
    {
        this._device = d
    }
}

export default Core