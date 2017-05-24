import fs from 'fs'
import xml2js from 'xml2js'
import _ from 'lodash'
import nodeZip from 'node-zip'
import parseLink from './link'

const xmlParser = new xml2js.Parser()

const xmlToJs = xml => {
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

const getRoot = opfPath => {
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

const parseToc = tocObj => {
  const rootNavPoints = _.get(tocObj, ['ncx', 'navMap', '0', 'navPoint'], [])

  function parseNavPoint(navPoint) {
    const src = _.get(navPoint, ['content', '0', '$', 'src'], '')
    const name = _.get(navPoint, ['navLabel', '0', 'text', '0'])
    const playOrder = _.get(navPoint, ['$', 'playOrder']) as string
    const parsedSrc = parseLink(src)
    let children = navPoint.navPoint

    if (children) {
      children = parseNavPoints(children)
    }

    return {
      src,
      srcObject: parsedSrc,
      name,
      playOrder,
      children
    }
  }

  function parseNavPoints(navPoints) {
    return navPoints.map(point => {
      return parseNavPoint(point)
    })
  }

  return parseNavPoints(rootNavPoints)
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

class Epub {
  private zip: any // nodeZip instance
  private opfPath: string
  private root: string
  private _content: GeneralObject
  private manifest: any[]
  private spine: string[] // array of ids defined in manifest
  private _toc: GeneralObject
  private _metadata: GeneralObject
  toc: GeneralObject
  metadata: GeneralObject
  bookContent: {
    id: string
    html: string
    path: string
    // todo: parseLink type
    pathObject: GeneralObject
  }[]

  constructor(buffer) {
    this.zip = new nodeZip(buffer, { binary: true, base64: false, checkCRC32: true })
  }

  resolve(path: string) {
    const file = this.zip.file(path)
    if (file) {
      return file
    } else {
      throw new Error(`${path} not found!`)
    }
  }

  async resolveXML(path) {
    const xml = this.resolve(path).asText()
    return xmlToJs(xml)
  }

  async _getOpfPath() {
    const container = await this.resolveXML('META-INF/container.xml')
    const opfPath = container.container.rootfiles[0].rootfile[0]['$']['full-path']
    return opfPath
  }

  _getManifest() {
    return _.get(this._content, ['package', 'manifest', 0, 'item'], [])
      .map(item => item.$) as any[]
  }

  _getSpine() {
    return _.get(this._content, ['package', 'spine', 0, 'itemref'], [])
      .map(item => {
        return item.$.idref
      })
  }

  _getContentFromSpine() {
    // no chain
    return _.map(_.union(this.spine), id => {
      const path = _.find(this.manifest, { id }).href
      const pathObject = parseLink(path)
      return {
        id,
        path,
        pathObject,
        html: this.resolve(`${this.root}${path}`).asText()
      }
    })
  }

  async parse() {
    this.opfPath = await this._getOpfPath()
    this.root = getRoot(this.opfPath)
    this._content = await this.resolveXML(this.opfPath)
    this.manifest = this._getManifest()
    this.spine = this._getSpine()

    const tocID = _.get(this._content, ['package', 'spine', 0, '$', 'toc']) as string
    const tocPath = _.find(this.manifest, { id: tocID }).href
    this._toc = await this.resolveXML(`${this.root}${tocPath}`)
    this.toc = parseToc(this._toc)
    this._metadata = _.get(this._content, ['package', 'metadata'], [])
    this.metadata = parseMetadata(this._metadata)
    this.bookContent = this._getContentFromSpine()
    return this
  }
}

const t = new Epub('fjij')

// t._z


interface ParserOptions {
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
