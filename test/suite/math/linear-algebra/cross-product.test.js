describe('math/linear-algebra/cross-product', () => {
    let page
    const timeout = 5000
    
    beforeAll(async () => {
        page = await global.__BROWSER_GLOBAL__.newPage()
        await page.goto('http://localhost:3000/test/suite/math/linear-algebra/cross-product.test.html', {
            waitUntil: 'networkidle0'
        })
    }, timeout)


    afterAll(async () => {
        await page.close()
    })

    it('should load http://localhost:3000/test/suite/math/linear-algebra/cross-product.test.html without error', async () => {
        let text = await page.evaluate(() => document.body.textContent)

        expect(text).toContain('linear-algebra/cross-product')

    }, timeout)

    it('should calculate the dot product of [9.0, 2.0. 7.0] * [4.0, 8.0, 10.0] as 122', async () => {
        let text = await page.evaluate( () => document.getElementById('crossProduct3').textContent )
        expect(text).toBe('-3,6,-3')
    })
    
})