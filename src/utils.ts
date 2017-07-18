import _ from 'lodash'

export interface ParseNestedObjectConfig {
  preFilter?: (node) => boolean
  postFilter?: (node) => boolean

  // children must be returned from parser
  // or it may not work as expected
  parser?: (node, children) => any
  finalParser?: (node) => any

  childrenKey: string
}

/**
 * parseNestedObject
 * a note about config.parser
 * `children` is a recursively parsed object and should be returned for parser to take effect
 * objects without `children` will be parsed by finalParser
 * @param _rootObject 
 * @param config 
 */
const parseNestedObjectWrapper = (_rootObject: Object | Object[], config: ParseNestedObjectConfig) => {
  const { childrenKey, parser, preFilter, postFilter, finalParser } = config

  if (!_rootObject) {
    return []
  }

  const parseNestedObject = (rootObject: any | any[]): any[] => {
    const makeArray = () => {
      if (Array.isArray(rootObject) || _.isArrayLikeObject(rootObject) || _.isArrayLike(rootObject)) {
        return rootObject
      }
      return [rootObject]
    }
    const rootArray = makeArray()

    let result = rootArray

    if (preFilter) {
      result = _.filter(result, preFilter)
    }

    result = _.map(result, (object, index) => {
      if (object[childrenKey]) {
        const parsedChildren = parseNestedObject(object[childrenKey])
        const children = _.isEmpty(parsedChildren) ? undefined : parsedChildren
        if (parser) {
          return parser(object, children)
        }
        return {
          ...object,
          ...{
            [childrenKey]: children
          }
        }
      }

      if (finalParser) {
        return finalParser(object)
      }
      return object
    })

    if (postFilter) {
      result = _.filter(result, postFilter)
    }

    return result
  }

  return _.flattenDeep(parseNestedObject(_rootObject))
}

export const parseNestedObject = parseNestedObjectWrapper
