require('babel-polyfill')
const express = require('express')
const http = require('http')
const app = express()
const epubParser = require('simple-epub-parser').default

app.use('/', (req, res) => {
  epubParser('./epubs/file-1.epub').then(result => {
    res.send(result)
  })
})

app.set('port', 3000)
http.createServer(app).listen(app.get('port'))
console.info('> Server runing on port 3000 ...')
