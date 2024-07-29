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
    // Happy path test 2D - Set x, y
    it('should represent a vector 2D [2.0, 3.0]', async () => {
        let text = await page.evaluate( () => document.getElementById('vector2D').textContent )
        expect(text).toBe('2, 3')
    })
    // Unhappy path test 2D - Set y only
    it('should represent a vector 2D [0.0, 3.0], if we omit x, and only set y to 3.0 ', async () => {
        let text = await page.evaluate( () => document.getElementById('vector2D_yonly').textContent )
        expect(text).toBe('0, 3')
    })

    // Happy path test 3D - Set x, y, z
    it('should represent a vector 3D [5.0, 6.0, 7.0]', async () => {
        let text = await page.evaluate( () => document.getElementById('vector3D').textContent )
        expect(text).toBe('5, 6, 7')
    })

    // Unhappy path test 3D
    it('should represent a vector 3D [0.0, 0.0, 3.0], if we omit x, y, and only set z to 7.0 ', async () => {
        let text = await page.evaluate( () => document.getElementById('vector3D_zonly').textContent )
        expect(text).toBe('0, 0, 7')
    })
    
    // Happy path test 4D
    it('should represent a vector 4D [1.0, 4.0, 9.0, 10.0]', async () => {
        let text = await page.evaluate( () => document.getElementById('vector4D').textContent )
        expect(text).toBe('1, 4, 9, 10')
    })

    // Unhappy path test 4D
    it('should represent a vector 4D [0.0, 0.0, 0.0, 10.0], if we omit x, y, z, and only set w to 10.0 ', async () => {
        let text = await page.evaluate( () => document.getElementById('vector4D_wonly').textContent )
        expect(text).toBe('0, 0, 0, 10')
    })

    // Happy path test ND
    it('should represent a vector ND of 5 dimensions [11.0, 13.0, 23.0, 42.0, 88]', async () => {
        let text = await page.evaluate( () => document.getElementById('vectorND').textContent )
        expect(text).toBe('11, 13, 23, 42, 88')
    })
})