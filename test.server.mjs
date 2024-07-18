import express from 'express'

const testServer = function (port = 3000) {
    const app = express()
    
    app.use(
        '/test',
        express.static('test')
    )

    app.use(
        '/src',
        express.static('src')
    )

    const server = app.listen(port, () => {
        console.log(`Test server listening on port ${port}`)
    })

    app.get('/close', () => {
        server.close(() => {})
    })
    return server
}
const server = testServer()

// export default testServer