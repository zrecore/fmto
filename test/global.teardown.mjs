/**
 * FMTO - Puppeteer + Jest teardown
 * Based on docs from jestjs.io - See https://jestjs.io/docs/puppeteer
 * 
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 */

import fs from 'fs'
import os from 'os'
import path from 'path'

const DIR = path.join(
    os.tmpdir(),
    'jest_puppeteer_global_setup'
)

export default async function ()
{
    // Close the browser instance
    await global.__BROWSER_GLOBAL__.close()

    // Clean up the wsEndpoint file
    await fs.rm(DIR, { recursive: true, force: true }, (error) => {
        // NOOP
    })
}