describe('math/linear-algebra/dot-product', () => {
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

    it('should calculate the dot product of [4.0, 8.0] * [7.0, 3.0] as 52', async () => {
        let text = await page.evaluate( () => document.getElementById('dotProduct2').textContent )
        expect(text).toBe('52')
    })

    it('should calculate the dot product of [9.0, 2.0, 7.0] * [4.0, 8.0, 10.0] as 122', async () => {
        let text = await page.evaluate( () => document.getElementById('dotProduct3').textContent )
        expect(text).toBe('122')
    })
    
})