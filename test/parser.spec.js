import expect from 'expect.js'
import parser from '../lib'
import _ from 'lodash'
import path from 'path'

const baseDir = process.cwd()
const filesToBeTested = ['file-1', 'file-2', 'file-3', 'file-4']
// const filesToBeTested = ['file-4']

const testFile = filename => {
  describe(`parser 测试 ${filename}.epub`, () => {
    const fileContent = parser(path.join(baseDir, `epubs/${filename}.epub`), { type: 'path' }).catch(error => {
      console.log(error)
    })

    it('内容对象包含三个 key', done => {
      fileContent
        .then(result => {
          const keys = _.keys(result)
          expect(keys.length).to.equal(3)
          done()
        })
    })

    it('key 分别为: flesh, nav, meta', done => {
      const expectedKeys = ['flesh', 'nav', 'meta']

      fileContent.then(result => {
        const keys = _.keys(result)
        keys.forEach(key => {
          expect(expectedKeys.indexOf(key)).to.not.be(-1)
        })
        done()
      })
    })
  })
}

filesToBeTested.forEach(filename => {
  testFile(filename)
})
