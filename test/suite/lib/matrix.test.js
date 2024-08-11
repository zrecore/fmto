/**
 * FMTO - WebGPU accelerated math library.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */
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
    it('should represent a matrix, default to 3D [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3D').textContent )
        expect(text).toBe('[[0, 0, 0], [0, 0, 0], [0, 0, 0]]')
    })

    // Happy path test 4D n x n - Instantiate default matrix 3D n x n
    it('should represent a matrix, default to 4D [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4D').textContent )
        expect(text).toBe('[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]')
    })

    // Happy path test 3D n x n matrices A and B. A + B
    it('should add 3x3 matrix A [[1,2,3],[4,5,6],[7,8,9]] to 3x3 matrix B [[10,20,30],[40,50,60],[70,80,90]], resulting in [[11, 22, 33], [44, 55, 66], [77, 88, 99]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3x3Add').textContent )
        
        expect(text).toBe('[[11, 22, 33], [44, 55, 66], [77, 88, 99]]')
    })
    
    it('should add 4x4 matrix A [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] to 4x4 matrix B [[10,20,30,40],[50,60,70,80],[90,100,110,120],[130,140,150,160]], resulting in [[11, 22, 33, 44], [55, 66, 77, 88], [99, 110, 121, 132], [143, 154, 165, 176]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4x4Add').textContent )
        
        expect(text).toBe('[[11, 22, 33, 44], [55, 66, 77, 88], [99, 110, 121, 132], [143, 154, 165, 176]]')
    })
})