/**
 * FMTO - Puppeteer + Jest setup
 * Based on docs from jestjs.io - See https://jestjs.io/docs/puppeteer
 * 
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 */
import promises from 'fs';
import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer';

const {
    mkdir,
    writeFile
} = promises;
const DIR = path.join(
    os.tmpdir(),
    'jest_puppeteer_global_setup'
);

export default async function () {
    // Launch headles, but do NOT disable webGPU support
    // See https://github.com/puppeteer/puppeteer/issues/1260
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--enable-gpu',
            '--headless',
            '--hide-scrollbars',
            '--mute-audio'
        ]
    })

    // Store the browser instance so we can teardown it later
    // this global is only available in the teardown but not in TestEnvironments
    global.__BROWSER_GLOBAL__ = browser
    // Use the file system to expose the wsEndpoint for TestEnvironments
    await promises.mkdir(
        DIR,
        {
            recursive: true
        },
        function () {}
    )
    await promises.writeFile(
        path.join(DIR, 'wsEndpoint'),
        browser.wsEndpoint(),
        function () {}
    )
};