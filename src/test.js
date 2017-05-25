const express = require('express')
const epubParser = require('../build/lib/epubParser').default
const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

epubParser(resolveApp('epubs/zhihu.epub')).then(result => {
  result.sections.forEach((item, index) => {
    const obj = item.toHtmlObject()
    const md = item.toMarkdown()
  })
})

// const express = require('express')
// const http = require('http')
// const app = express()
// const epubParser = require('../build/lib/epubParser').default

// app.use('/', (req, res) => {
//   epubParser(resolveApp('epubs/zhihu.epub')).then(result => {
//     result.sections.forEach((item, index) => {
//       const obj = item.toHtmlObject()
//       if (index > 10) {
//         res.send('ok')
//       }
//     })
//   })
// })

// app.set('port', 3000)
// http.createServer(app).listen(app.get('port'))
// console.info('> Server runing on port 3000 ...')
