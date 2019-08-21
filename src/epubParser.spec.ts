import parser from './epubParser'
import _ from 'lodash'
import * as path from 'path'

const baseDir = process.cwd()
const filesToBeTested = ['file-1', 'file-2', 'file-3', 'file-4']

const testFile = filename => {
  describe(`parser 测试 ${filename}.epub`, () => {
    const fileContent = parser(path.join(baseDir, `epubs/${filename}.epub`), { type: 'path' }).catch(error => {
      console.log(error)
    })

    it('Result should have keys', done => {
      fileContent.then(result => {
        const keys = _.keys(result)
        expect(keys.length).not.toBe(0)
        done()
      })
    })

    // it('key 分别为: flesh, nav, meta', done => {
    //   const expectedKeys = ['flesh', 'nav', 'meta']

    //   fileContent.then(result => {
    //     const keys = _.keys(result)
    //     keys.forEach(key => {
    //       expect(expectedKeys.indexOf(key)).to.not.be(-1)
    //     })
    //     done()
    //   })
    // })
  })
}

filesToBeTested.forEach(filename => {
  testFile(filename)
})
