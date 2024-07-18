/** @type {import('jest').Config} */
const config = {
    "preset": "jest-puppeteer",
    "globalSetup": "./global.setup.mjs",
    "globalTeardown": "./global.teardown.mjs",
    "testEnvironment": "./global.environment.mjs"

}

export default config