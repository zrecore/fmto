import puppeteer from 'puppeteer';
import express from 'express';

const app = express();
const port = 3000;

app.use(
    express.static('../')
)

const server = app.listen(port, () => {
    console.log(`Test server listening on port ${port}`)
});

// Launch headles, but do NOT disable webGPU support
// See https://github.com/puppeteer/puppeteer/issues/1260
const browser = await puppeteer.launch({
    headless: false,
    args: [
        '--enable-gpu',
        // '--headless',
        '--hide-scrollbars',
        '--mute-audio'
    ]
});
const page = await browser.newPage();

await page.goto(`http://localhost:${port}/test/index.test.html`);
await page.setViewport({width: 1080, height: 1024});

await browser.close();

server.close(() => {
    console.log("Close test server.");
    process.exit(0);
});