/**
 * Puppeteer + Jest. Test Environment setup.
 * Based on https://jestjs.io/docs/puppeteer
 * 
 * @author Alex Albino <webmaster@alexventure.com>
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import puppeteer from 'puppeteer'

import jestEnvironmentNode from 'jest-environment-node'

const { readFile } = fs.promises
const NodeEnvironment = jestEnvironmentNode.TestEnvironment

const DIR = path.join(
    os.tmpdir(),
    'jest_puppeteer_global_setup'
)

export default class PuppeteerEnviornment extends NodeEnvironment
{
    constructor(config)
    {
        super(config)
    }

    async setup()
    {
        await super.setup()

        // get the wsEndpoint
        const wsEndpoint = await readFile(path.join(DIR, 'wsEndpoint'), 'utf8')

        if (!wsEndpoint)
        {
            throw new Error('global.environment.mjs: setup() wsEndpoint not found.')
        }

        // connect to puppeteer
        this.global.__BROWSER_GLOBAL__ = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint
        })
    }

    async teardown()
    {
        if (this.global.__BROWSER_GLOBAL__)
        {
            this.global.__BROWSER_GLOBAL__.disconnect()
        }

        await super.teardown()
    }

    getVmContext()
    {
        return super.getVmContext()
    }
}

export { PuppeteerEnviornment }