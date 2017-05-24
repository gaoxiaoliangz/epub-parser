const express = require('express')
const http = require('http')
const app = express()
const epubParser = require('../../lib/index.js').default

app.use('/', (req, res) => {
  epubParser('../../epubs/file-1.epub').then(result => {
    const obj = result.sections[1].toHtmlObject()
    res.send('ok')
  })
})

app.set('port', 3000)
http.createServer(app).listen(app.get('port'))
console.info('> Server runing on port 3000 ...')
