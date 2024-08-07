/**
 * FMTO - Core
 */
class Core
{
    /**
     * @type GPUAdapter
     */
    static _adapter = null
    /**
     * @type GPUDevice
     */
    static _device = null

    constructor() {}

    /**
     * Initialize the GPUAdapter
     * @returns boolean
     */
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

    /**
     * Initialize the GPUDevice
     * @returns boolean
     */
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
    /**
     * @returns GPUAdapter
     */
    get adapter()
    {
        return this._adapter
    }
    /**
     * @param {GPUAdapter} a 
     */
    set adapter(a)
    {
        this._adapter = a
    }
    /**
     * @returns GPUDevice
     */
    get device()
    {
        return this._device
    }
    /**
     * @param {GPUDevice} d
     */
    set device(d)
    {
        this._device = d
    }
}

export default Core