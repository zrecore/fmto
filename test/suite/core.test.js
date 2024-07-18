const timeout = 5000

describe('core', () => {
    let page

    beforeAll(async () => {
        page = await global.__BROWSER_GLOBAL__.newPage()
        await page.goto('https://google.com')
    }, timeout)

    afterAll(async () => {
        await page.close()
    })

    it('should load google.com without error', async () => {
        let text = await page.evaluate(() => document.body.textContent)

        expect(text).toContain('google')
    }, timeout)
})