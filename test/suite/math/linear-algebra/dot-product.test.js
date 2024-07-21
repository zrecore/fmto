describe('core', () => {
    let page
    const timeout = 5000
    
    beforeAll(async () => {
        page = await global.__BROWSER_GLOBAL__.newPage()
        await page.goto('http://localhost:3000/test/suite/math/linear-algebra/dot-product.test.html', {
            waitUntil: 'networkidle0'
        })
    }, timeout)


    afterAll(async () => {
        await page.close()
    })

    it('should load http://localhost:3000/test/suite/math/linear-algebra/dot-product.test.html without error', async () => {
        let text = await page.evaluate(() => document.body.textContent)

        expect(text).toContain('linear-algebra/dot-product')

    }, timeout)

    it('should have a WebGPU adapter', async () => {
        let text = await page.evaluate( () => document.getElementById('hasAdapter').textContent )
        expect(text).toBe('true')

    })

    it('should have a WebGPU device', async () => {
        let text = await page.evaluate( () => document.getElementById('hasDevice').textContent )

        expect(text).toBe('true')

    })

    it('should calculate the dot product of [9.0, 2.0. 7.0] * [4.0, 8.0, 10.0] as 122', async () => {
        let text = await page.evaluate( () => document.getElementById('dotProduct3').textContent )
        expect(text).toBe('122')
    })
    
})