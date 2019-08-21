// @ts-check
const { parseEpub } = require('../../lib')

parseEpub('../../fixtures/zhihu.epub').then(result => {
  console.log('result object has keys: ', Object.keys(result))
  console.log('book info', result.info)
  console.log('book structure', result.structure)
  console.log('the book has', result.sections.length, 'sections')
  console.log('here is first section')
  console.log(result.sections[0])
  console.log('secton html to markdown')
  console.log(result.sections[0].toMarkdown())
})
