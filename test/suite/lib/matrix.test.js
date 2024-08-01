describe('lib/matrix', () => {
    let page
    const timeout = 5000
    
    beforeAll(async () => {
        page = await global.__BROWSER_GLOBAL__.newPage()
        await page.goto('http://localhost:3000/test/suite/lib/matrix.test.html', {
            waitUntil: 'networkidle0'
        })
    }, timeout)


    afterAll(async () => {
        await page.close()
    })
    // Happy path test 2D n x n - Instantiate default matrix 2D n x n
    it('should represent a matrix, default to 2D [[0.0, 0.0], [0.0, 0.0]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix2D').textContent )
        expect(text).toBe('[[0, 0], [0, 0]]')
    })

    // Happy path test 3D n x n - Instantiate default matrix 3D n x n
    /*it('should represent a matrix, default to 3D [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3D').textContent )
        expect(text).toBe('[[0, 0, 0], [0, 0, 0], [0, 0, 0]]')
    })

    // Happy path test 4D n x n - Instantiate default matrix 3D n x n
    it('should represent a matrix, default to 4D [[0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3D').textContent )
        expect(text).toBe('[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]')
    })*/
    
})