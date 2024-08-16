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
    // Happy path test 4D n x n matrices A and B. A + B
    it('should add 4x4 matrix A [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] to 4x4 matrix B [[10,20,30,40],[50,60,70,80],[90,100,110,120],[130,140,150,160]], resulting in [[11, 22, 33, 44], [55, 66, 77, 88], [99, 110, 121, 132], [143, 154, 165, 176]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4x4Add').textContent )
        
        expect(text).toBe('[[11, 22, 33, 44], [55, 66, 77, 88], [99, 110, 121, 132], [143, 154, 165, 176]]')
    })

    // Happy path test 3D n x n matrices A and B. A - B
    it('should subtract 3x3 matrix A [[1,2,3],[4,5,6],[7,8,9]] to 3x3 matrix B [[10,20,30],[40,50,60],[70,80,90]], resulting in [[-9, -18, -27], [-36, -45, -54], [-63, -72, -81]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3x3Subtract').textContent )
        
        expect(text).toBe('[[-9, -18, -27], [-36, -45, -54], [-63, -72, -81]]')
    })
    // Happy path test 4D n x n matrices A and B. A - B
    it('should subtract 4x4 matrix A [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] to 4x4 matrix B [[10,20,30,40],[50,60,70,80],[90,100,110,120],[130,140,150,160]], resulting in [[-9, -18, -27, -36], [-45, -54, -63, -72], [-81, -90, -99, -108], [-117, -126, -135, -144]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4x4Subtract').textContent )
        
        expect(text).toBe('[[-9, -18, -27, -36], [-45, -54, -63, -72], [-81, -90, -99, -108], [-117, -126, -135, -144]]')
    })

    // Happy path test 3D n x n matrix A and scalar 2. A * 2
    it('should scale 3x3 matrix A [[1,2,3],[4,5,6],[7,8,9]] by scalar 2, resulting in [[2, 4, 6], [8, 10, 12], [14, 16, 18]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3x3Scale').textContent )
        
        expect(text).toBe('[[2, 4, 6], [8, 10, 12], [14, 16, 18]]')
    })
    // Happy path test 4D n x n matrix A and scalar 2. A * 2
    it('should scale 4x4 matrix A [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] by scalar 2, resulting in [[2, 4, 6, 8], [10, 12, 14, 16], [18, 20, 22, 24], [26, 28, 30, 32]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4x4Scale').textContent )
        
        expect(text).toBe('[[2, 4, 6, 8], [10, 12, 14, 16], [18, 20, 22, 24], [26, 28, 30, 32]]')
    })

    // Happy path test 3D n x n matrices A and B. A * B
    it('should scale 3x3 matrix A [[1,2,3],[4,5,6],[7,8,9]] by 3x3 matrix B [[10,20,30],[40,50,60],[70,80,90]], resulting in [[300, 360, 420], [660, 810, 960], [1020, 1260, 1500]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3x3Product').textContent )
        
        expect(text).toBe('[[300, 360, 420], [660, 810, 960], [1020, 1260, 1500]]')
    })
    // Happy path test 4D n x n matrices A and B. A * B
    it('should scale 4x4 matrix A [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] by 4x4 matrix B [[10,20,30,40],[50,60,70,80],[90,100,110,120],[130,140,150,160]], resulting in [[900, 1000, 1100, 1200], [2020, 2280, 2540, 2800], [3140, 3560, 3980, 4400], [4260, 4840, 5420, 6000]]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4x4Product').textContent )
        
        expect(text).toBe('[[900, 1000, 1100, 1200], [2020, 2280, 2540, 2800], [3140, 3560, 3980, 4400], [4260, 4840, 5420, 6000]]')
    })

    // Happy path test 3D n x n matrices A and vector3. A * vector3
    it('should multiply 3x3 matrix A [[1,2,3],[4,5,6],[7,8,9]] with 3D vector [1,2,4], resulting in 3D vector [37, 44, 51]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3x3MultiplyMV').textContent )
        
        expect(text).toBe('[37, 44, 51]')
    })
    // Happy path test 4D n x n matrices A and B. A * vector4
    it('should multiply 4x4 matrix A [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] with 4D vector[1,2,4,8], resulting in 4D vector [151, 166, 181, 196]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4x4MultiplyMV').textContent )
        
        expect(text).toBe('[151, 166, 181, 196]')
    })

    // Happy path test 3D n x n matrices A and vector3. vector3 * A
    it('should multiply 3D vector [1,2,4] with 3x3 matrix A [[1,2,3],[4,5,6],[7,8,9]], resulting in 3D vector [17, 38, 59]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix3x3MultiplyVM').textContent )
        
        expect(text).toBe('[17, 38, 59]')
    })
    // Happy path test 4D n x n matrices A and B. vector4 * A
    it('should multiply 4D vector[1,2,4,8] with 4x4 matrix A [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]], resulting in 4D vector [49, 109, 169, 229]', async () => {
        let text = await page.evaluate( () => document.getElementById('matrix4x4MultiplyVM').textContent )
        
        expect(text).toBe('[49, 109, 169, 229]')
    })
})