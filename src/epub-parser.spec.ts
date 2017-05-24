import _ from 'lodash'
import expect from 'expect.js'

describe('ts-jest test', () => {
  it('should be equal', () => {
    const a = { b: 2}
    expect(_.get(a, 'b')).to.equal(1)
  })
})
