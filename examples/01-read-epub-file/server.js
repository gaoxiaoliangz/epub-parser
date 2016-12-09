const express = require('express')
const http = require('http')
const app = express()

app.use('/', (req, res) => {
  res.send('server runing')
})

app.set('port', 3000)
http.createServer(app).listen(app.get('port'))
console.info('> Server runing on port 3000 ...')
