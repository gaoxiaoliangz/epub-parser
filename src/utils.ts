import _ from 'lodash'
import { GeneralObject } from './types'

export interface TraverseNestedObject {
  preFilter?: (node: GeneralObject) => boolean
  postFilter?: (node: GeneralObject) => boolean

  // children must be returned from transformer
  // or it may not work as expected
  transformer?: (node: GeneralObject, children?: GeneralObject[]) => any
  finalTransformer?: (node: GeneralObject) => any

  childrenKey: string
}

/**
 * traverseNestedObject
 * a note about config.transformer
 * `children` is a recursively transformed object and should be returned for transformer to take effect
 * objects without `children` will be transformed by finalTransformer
 * @param _rootObject
 * @param config
 */
export const traverseNestedObject = (
  _rootObject: Object | Object[],
  config: TraverseNestedObject,
) => {
  const { childrenKey, transformer, preFilter, postFilter, finalTransformer } = config

  if (!_rootObject) {
    return []
  }

  const traverse = (rootObject: any | any[]): any[] => {
    const makeArray = () => {
      if (
        Array.isArray(rootObject) ||
        _.isArrayLikeObject(rootObject) ||
        _.isArrayLike(rootObject)
      ) {
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
        const transformedChildren = traverse(object[childrenKey])
        // in parseHTML, if a tag is in unwrap list, like <span>aaa<span>bbb</span></span>
        // the result needs to be flatten
        const children = _.isEmpty(transformedChildren)
          ? undefined
          : _.flattenDeep(transformedChildren)
        if (transformer) {
          return transformer(object, children)
        }
        return {
          ...object,
          ...{
            [childrenKey]: children,
          },
        }
      }

      if (finalTransformer) {
        return finalTransformer(object)
      }
      return object
    })

    if (postFilter) {
      result = _.filter(result, postFilter)
    }

    return result
  }

  return _.flattenDeep(traverse(_rootObject))
}
