import fs from 'fs'
import xml2js from 'xml2js'
import _ from 'lodash'
import parseHref from './href'
import * as mdConverters from './md-converters'
import nodeZip from 'node-zip'
import toMarkdown from 'to-markdown'

const xmlParser = new xml2js.Parser()

const parseToc = tocObj => {
  const rootNavPoints = _.get(tocObj, ['ncx', 'navMap', '0', 'navPoint'], [])

  function parseNavPoint(navPoint) {
    const src = _.get(navPoint, ['content', '0', '$', 'src'], '')
    const label = _.get(navPoint, ['navLabel', '0', 'text', '0'])
    const index = parseInt(_.get(navPoint, ['$', 'playOrder']) as string, 10) - 1

    const parsedSrc = parseHref(src)

    let children = navPoint.navPoint

    if (children) {
      children = parseNavPoints(children)
    }

    return {
      ref: parsedSrc.name,
      hash: parsedSrc.hash,
      label,
      index,
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

const resolveContent = zipPath => zipInstance => {
  const content = zipInstance.file(zipPath)

  if (content) {
    return toMarkdown(content.asText(), {
      converters: [mdConverters.h, mdConverters.span, mdConverters.div, mdConverters.img, mdConverters.a]
    })
  }

  return ''
}

const getContentFromSpine = (spine, root) => zipInstance => {
  // no chain
  return _.map(_.union(spine), href => ({
    id: parseHref(href).name,
    markdown: resolveContent(`${root}${href}`)(zipInstance)
  }))
}

const extractZipContent = filepath => zip => {
  const file = zip.file(filepath)
  if (file) {
    return file.asText()
  } else {
    throw new Error(`${filepath} not found!`)
  }
}

const getOpsRoot = opfPath => {
  let opsRoot = ''
  // set the opsRoot for resolving paths
  if (opfPath.match(/\//)) { // not at top level
    opsRoot = opfPath.replace(/\/([^\/]+)\.opf/i, '')
    if (!opsRoot.match(/\/$/)) { // 以 '/' 结尾，下面的 zip 路径写法会简单很多
      opsRoot += '/'
    }
    if (opsRoot.match(/^\//)) {
      opsRoot = opsRoot.replace(/^\//, '')
    }
  }
  return opsRoot
}

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

export async function binaryParser(binaryFile) {
  try {
    const zip = new nodeZip(binaryFile, { binary: true, base64: false, checkCRC32: true })
    const containerXml = extractZipContent('META-INF/container.xml')(zip)
    const containerJSON = await xmlToJs(containerXml)
    const opfPath = containerJSON.container.rootfiles[0].rootfile[0]['$']['full-path']
    const root = getOpsRoot(opfPath)
    // opf file
    const contentXml = extractZipContent(opfPath)(zip)
    const contentJSON = await xmlToJs(contentXml)
    const ncxId = _.get(contentJSON, ['package', 'spine', 0, '$', 'toc'])
    let ncxPath = ''

    const manifest = _.get(contentJSON, ['package', 'manifest', 0, 'item'], [])
      .map(item => item.$)
      .map(item => {
        if (item.id === ncxId) {
          ncxPath = item.href
        }
        return {
          id: item.id,
          href: item.href
        }
      })

    const spine = _.get(contentJSON, ['package', 'spine', 0, 'itemref'], [])
      .map(item => {
        return item.$.idref
      })
      .map(id => {
        return _.find(manifest, { id }).href
      })

    // TODO: ncxPath is null
    const tocXml = extractZipContent(`${root}${ncxPath}`)(zip)
    const tocJSON = await xmlToJs(tocXml)
    const parsedToc = parseToc(tocJSON)

    const metadata = _.get(contentJSON, ['package', 'metadata'], [])
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

    const flesh = getContentFromSpine(spine, root)(zip)

    return ({
      meta,
      nav: parsedToc,
      flesh
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

export interface ParserOptions {
  type?: 'binaryString' | 'path' | 'buffer'
}
export default function parser(target: string | Buffer, options: ParserOptions = {}) {
  // seems 260 is the length limit of old windows standard
  // so path length is not used to determine whether it's path or binary string
  // the downside here is that if the filepath is incorrect, it will be treated as binary string by default
  // but it can use options to define the target type
  if (options.type === 'path' || (typeof target === 'string' && fs.existsSync(target))) {
    const binaryString = fs.readFileSync(target as string, 'binary')
    return binaryParser(binaryString)
  } else {
    return binaryParser(target)
  }
}
