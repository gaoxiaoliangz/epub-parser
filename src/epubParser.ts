import * as fs from 'fs'
import * as xml2js from 'xml2js'
import * as _ from 'lodash'
import * as nodeZip from 'node-zip'
import * as md5 from 'md5'
import parseLink from './link'
import parseSection, { Section } from './parseSection'

const xmlParser = new xml2js.Parser()

const xmlToJs = (xml) => {
  return new Promise<any>((resolve, reject) => {
    xmlParser.parseString(xml, (err, object) => {
      if (err) {
        reject(err)
      } else {
        resolve(object)
      }
    })
  })
}

const determineRoot = (opfPath) => {
  let root = ''
  // set the opsRoot for resolving paths
  if (opfPath.match(/\//)) { // not at top level
    root = opfPath.replace(/\/([^\/]+)\.opf/i, '')
    if (!root.match(/\/$/)) { // 以 '/' 结尾，下面的 zip 路径写法会简单很多
      root += '/'
    }
    if (root.match(/^\//)) {
      root = root.replace(/^\//, '')
    }
  }
  return root
}

const parseMetadata = metadata => {
  const title = _.get(metadata[0], ['dc:title', 0])
  let author = _.get(metadata[0], ['dc:creator', 0])

  if (typeof author === 'object') {
    author = _.get(author, ['_'])
  }

  const publisher = _.get(metadata[0], ['dc:publisher', 0])
  const meta = {
    title,
    author,
    publisher
  }
  return meta
}

export class Epub {
  private _zip: any // nodeZip instance
  // private _opfPath: string
  private _root: string
  private _content: GeneralObject
  private manifest: any[]
  private _spine: string[] // array of ids defined in manifest
  private _toc: GeneralObject
  private _metadata: GeneralObject
  structure: GeneralObject
  metadata: GeneralObject
  // sections: {
  //   id: string
  //   html: string
  //   path: string
  //   // todo: parseLink type
  //   pathObject: GeneralObject
  // }[]
  sections: Section[]

  constructor(buffer) {
    this._zip = new nodeZip(buffer, { binary: true, base64: false, checkCRC32: true })
  }

  resolve(path: string): {
    asText: () => string
  } {
    let _path
    if (path[0] === '/') {
      // use absolute path, root is zip root
      _path = path.substr(1)
    } else {
      _path = this._root + path
    }
    const file = this._zip.file(_path)
    if (file) {
      return file
    } else {
      throw new Error(`${_path} not found!`)
    }
  }

  async _resolveXMLAsJsObject(path) {
    const xml = this.resolve(path).asText()
    return xmlToJs(xml)
  }

  private async _getOpfPath() {
    const container = await this._resolveXMLAsJsObject('/META-INF/container.xml')
    const opfPath = container.container.rootfiles[0].rootfile[0]['$']['full-path']
    return opfPath
  }

  _genStructure(tocObj) {
    const rootNavPoints = _.get(tocObj, ['ncx', 'navMap', '0', 'navPoint'], [])

    const parseNavPoint = (navPoint) => {
      // link to section
      const link = _.get(navPoint, ['content', '0', '$', 'src'], '')
      // const name = _.get(navPoint, ['navLabel', '0', 'text', '0'])
      const playOrder = _.get(navPoint, ['$', 'playOrder']) as string
      const { hash } = parseLink(link)
      let children = navPoint.navPoint

      if (children) {
        // tslint:disable-next-line:no-use-before-declare
        children = parseNavPoints(children)
      }

      const sectionId = this._resolveIdFromLink(link)

      return {
        sectionId,
        hash,
        // srcObject: parsedSrc,
        // name,
        playOrder,
        children
      }
    }

    const parseNavPoints = (navPoints) => {
      return navPoints.map(point => {
        return parseNavPoint(point)
      })
    }

    return parseNavPoints(rootNavPoints)
  }

  _getManifest() {
    return _.get(this._content, ['package', 'manifest', 0, 'item'], [])
      .map(item => item.$) as any[]
  }

  _resolveIdFromLink(href) {
    const { name: tarName } = parseLink(href)
    const tarItem = _.find(this.manifest, item => {
      const { name } = parseLink(item.href)
      return name === tarName
    })
    const id = _.get(tarItem, 'id', '')
    if (id) {
      return md5(id)
    }
    return null
  }

  _getSpine() {
    return _.get(this._content, ['package', 'spine', 0, 'itemref'], [])
      .map(item => {
        return item.$.idref
      })
  }

  _resolveSectionsFromSpine() {
    // no chain
    return _.map(_.union(this._spine), id => {
      const path = _.find(this.manifest, { id }).href
      // const pathObject = parseLink(path)
      const html = this.resolve(path).asText()
      return parseSection({
        id,
        htmlString: html,
        resourceResolver: this.resolve.bind(this),
        idResolver: this._resolveIdFromLink.bind(this)
      })
    })
  }

  async parse() {
    const opfPath = await this._getOpfPath()
    this._root = determineRoot(opfPath)
    this._content = await this._resolveXMLAsJsObject('/' + opfPath)
    this.manifest = this._getManifest()
    this._spine = this._getSpine()
    const tocID = _.get(this._content, ['package', 'spine', 0, '$', 'toc']) as string
    const tocPath = _.find(this.manifest, { id: tocID }).href
    this._toc = await this._resolveXMLAsJsObject(tocPath)
    this.structure = this._genStructure(this._toc)
    this._metadata = _.get(this._content, ['package', 'metadata'], [])
    this.metadata = parseMetadata(this._metadata)
    this.sections = this._resolveSectionsFromSpine()

    // remove private member vars
    // const isPrivateProp = key => {
    //   if (key.length > 1) {
    //     if (key[0] === '_' && key[1] !== '_') {
    //       return true
    //     }
    //     return false
    //   }
    //   return false
    // }

    // _.forEach(this, (val, key) => {
    //   if (isPrivateProp(key)) {
    //     delete this[key]
    //   }
    // })

    return this
  }
}

export interface ParserOptions {
  type?: 'binaryString' | 'path' | 'buffer'
}
export default function parserWrapper(target: string | Buffer, options: ParserOptions = {}) {
  // seems 260 is the length limit of old windows standard
  // so path length is not used to determine whether it's path or binary string
  // the downside here is that if the filepath is incorrect, it will be treated as binary string by default
  // but it can use options to define the target type
  let _target = target
  if (options.type === 'path' || (typeof target === 'string' && fs.existsSync(target))) {
    _target = fs.readFileSync(target as string, 'binary')
  }
  return new Epub(_target).parse()
}
