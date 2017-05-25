import parser from './epubParser'
import parseLink from './parseLink'
import parseHTML from './parseHTML'
import { parseNestedObject, flattenArray } from './utils'

export {
  parseLink,
  parseHTML,
  parseNestedObject,
  flattenArray
}
export default parser
