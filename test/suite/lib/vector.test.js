describe('lib/vector', () => {
    let page
    const timeout = 5000
    
    beforeAll(async () => {
        page = await global.__BROWSER_GLOBAL__.newPage()
        await page.goto('http://localhost:3000/test/suite/lib/vector.test.html', {
            waitUntil: 'networkidle0'
        })
    }, timeout)


    afterAll(async () => {
        await page.close()
    })

    it('should represent a vector 2D [2.0, 3.0]', async () => {
        let text = await page.evaluate( () => document.getElementById('vector2D').textContent )
        expect(text).toBe('2, 3')
    })

    it('should represent a vector 3D [5.0, 6.0, 7.0]', async () => {
        let text = await page.evaluate( () => document.getElementById('vector3D').textContent )
        expect(text).toBe('5, 6, 7')
    })
    
    it('should represent a vector 4D [1.0, 4.0, 9.0, 10.0]', async () => {
        let text = await page.evaluate( () => document.getElementById('vector4D').textContent )
        expect(text).toBe('1, 4, 9, 10')
    })

    it('should represent a vector ND of 5 dimensions [11.0, 13.0, 23.0, 42.0, 88]', async () => {
        let text = await page.evaluate( () => document.getElementById('vectorND').textContent )
        expect(text).toBe('11, 13, 23, 42, 88')
    })
})