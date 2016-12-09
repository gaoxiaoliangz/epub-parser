import expect from 'expect.js'
import assert from 'assert'
import parser from '../lib'
import _ from 'lodash'
import path from 'path'

const baseDir = process.cwd()

console.log(path.extname('./hee/da/nima.js#jfiej89'))

describe('parser', () => {
  it('相等', () => {
    const fileContent = parser(path.join(baseDir, 'epubs/file-1.epub'))
    fileContent.then(result => {
      console.log(_.keys(result))
      
    })
    console.log(fileContent)
    
    const keys = _.keys(fileContent)
    console.log(keys)
    
    assert.equal(1, 1)
  })
})
