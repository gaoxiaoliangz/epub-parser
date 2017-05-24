import _ from 'lodash'

const debug = require('debug')('readr:parsers:utils')

export function flattenArray(arrayOfNestedObj, childrenName = 'children') {
  const list = []

  const push = infoList => {
    infoList.forEach(item => {
      list.push(_.omit(item, childrenName))
      if (item[childrenName]) {
        push(item[childrenName])
      }
    })
  }

  push(arrayOfNestedObj)
  return list
}

interface ParseNestedObjectConfig {
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
 * 'children' is recursively parsed object and should be returned for parser to take effect
 * objects without [childrenKey] will be parsed by finalParser
 * @param _rootObject 
 * @param config 
 */
const parseNestedObjectWrapper = (_rootObject: Object | Object[], config: ParseNestedObjectConfig) => {
  const { childrenKey, parser, preFilter, postFilter, finalParser } = config

  if (!_rootObject) {
    return []
  }

  const parseNestedObject = (rootObject: Object | Object[]): any[] => {
    const makeArray = () => {
      if (Array.isArray(rootObject) || _.isArrayLikeObject(rootObject) || _.isArrayLike(rootObject)) {
        return rootObject
      }
      return [rootObject]
    }
    const rootArray = makeArray()

    return Array.prototype
      .filter.call(rootArray, object => {
        if (preFilter) {
          return preFilter(object)
        }
        return true
      })
      .map((object, index) => {
        if (object[childrenKey]) {
          const children = parseNestedObject(object[childrenKey])
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
      .filter(object => {
        if (postFilter) {
          return postFilter(object)
        }
        return true
      })
  }

  return parseNestedObject(_rootObject)
}

export const parseNestedObject = parseNestedObjectWrapper
