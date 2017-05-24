import path from 'path'
import parseHTML from './parseHTML'
import parseLink from './link'

const isInternalUri = uri => {
  return uri.indexOf('http://') === -1 && uri.indexOf('https://') === -1
}

type ParseSectionConfig = {
  id: string
  htmlString: string
  resourceResolver: any // function
}

export class Section {
  id: string
  htmlString: string
  private _resourceResolver: any // function

  constructor({ id, htmlString, resourceResolver }: ParseSectionConfig) {
    this.id = id
    this.htmlString = htmlString
    this._resourceResolver = resourceResolver
  }

  toHtmlObject() {
    return parseHTML(this.htmlString, {
      resolveHref: (href) => {
        if (isInternalUri(href)) {
          const { name, hash } = parseLink(href)
          if (hash) {
            return `#${name},${hash}`
          }
          return `#${name}`
        }
        return href
      },
      resolveSrc: (src) => {
        if (isInternalUri(src)) {
          // todo: may have bugs
          const absolutePath = path.resolve('/', src).substr(1)
          const buffer = this._resourceResolver(absolutePath).asNodeBuffer()
          const base64 = buffer.toString('base64')
          return `data:image/png;base64,${base64}`
        }
        return src
      }
    })
  }
}

const parseSection = (config: ParseSectionConfig) => {
  return new Section(config)
}

export default parseSection
