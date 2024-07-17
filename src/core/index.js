/**
 * FMTO - Core
 */
class core
{
    static _adapter = null;
    static _device = null;

    async initializeAdapter()
    {
        if (!navigator.gpu)
        {
            return false;
        }

        this.adapter = await navigator.gpu.requestAdapter();

        if (!this.adapter)
        {
            return false;
        }

        return true;
    }

    async initializeDevice()
    {
        if (!this._adapter)
        {
            if (!this.initializeAdapter())
            {
                return false;
            }
        }

        this._device = await this.adapter().requestDevice();

        return true;
    }

    get adapter()
    {
        return this._adapter;
    }

    get device()
    {
        return this._device;
    }
}
