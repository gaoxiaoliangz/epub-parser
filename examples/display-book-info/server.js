const express = require('express')
const http = require('http')
const app = express()
const epubParser = require('../../build/lib/epubParser').default

app.use('/', (req, res) => {
  epubParser('../../epubs/zhihu.epub').then(result => {
    res.send(JSON.stringify(result.meta))
  })
})

app.set('port', 3000)
http.createServer(app).listen(app.get('port'))
console.info('> Server runing on port 3000 ...')
