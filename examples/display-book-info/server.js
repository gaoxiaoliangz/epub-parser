const express = require('express')
const http = require('http')
const app = express()
const epubParser = require('./build/epubParser').default

app.use('/', (req, res) => {
  epubParser('../../epubs/zhihu.epub').then(result => {
    result.sections.forEach((item, index) => {
      const obj = item.toHtmlObject()
      if (index > 10) {
        res.send('ok')
      }
    })
  })
})

app.set('port', 3000)
http.createServer(app).listen(app.get('port'))
console.info('> Server runing on port 3000 ...')
