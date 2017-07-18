const express = require('express')
const epubParser = require('../build/lib/epubParser').default
const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

console.time('parse')
epubParser(resolveApp('epubs/zhihu.epub'), {
  expand: false
}).then(result => {
  console.timeEnd('parse')
  result.sections.forEach((item, index) => {
    const obj = item.toHtmlObjects()
    const md = item.toMarkdown()
  })
})
