/**
 * FMTO - WebGPU accelerated math library.
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 * @version 1.0.0
 */
describe('core', () => {
    let page
    const timeout = 5000
    
    beforeAll(async () => {
        page = await global.__BROWSER_GLOBAL__.newPage()
        await page.goto('http://localhost:3000/test/suite/core.test.html', {
            waitUntil: 'networkidle0'
        })
    }, timeout)


    afterAll(async () => {
        await page.close()
    })

    it('should load http://localhost:3000/test/suite/core.test.html without error', async () => {
        let text = await page.evaluate(() => document.body.textContent)

        expect(text).toContain('core')

    }, timeout)

    it('should have a WebGPU adapter', async () => {
        let text = await page.evaluate(() => document.getElementById('hasAdapter').textContent )
        expect(text).toBe('true')

    })

    it('should have a WebGPU device', async () => {
        let text = await page.evaluate(() => document.getElementById('hasDevice').textContent )

        expect(text).toBe('true')

    })
    
})