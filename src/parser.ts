import fs from 'fs'
import xml2js from 'xml2js'
import _ from 'lodash'
import parseHref from './href'
import * as mdConverters from './md-converters'
const nodeZip = require('node-zip')
const toMarkdown = require('to-markdown')

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
  return _(spine)
    .union()
    .map(href => ({
      id: parseHref(href).name,
      markdown: resolveContent(`${root}${href}`)(zipInstance)
    }))
    .value()
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
    const contentXml = extractZipContent(`${root}content.opf`)(zip)
    const tocXml = extractZipContent(`${root}toc.ncx`)(zip)

    const tocJSON = await xmlToJs(tocXml)
    const parsedToc = parseToc(tocJSON)

    const contentJSON = await xmlToJs(contentXml)
    const metadata = _.get(contentJSON, ['package', 'metadata'], [])
    const title = _.get(metadata[0], ['dc:title', 0])
    let author = _.get(metadata[0], ['dc:creator', 0])

    const manifest = _.get(contentJSON, ['package', 'manifest', 0, 'item'], [])
      .map(item => item.$)
      .map(item => ({
        id: item.id,
        href: item.href
      }))

    const spine = _.get(contentJSON, ['package', 'spine', 0, 'itemref'], [])
      .map(item => item.$.idref)
      .map(id => {
        return _.find(manifest, { id }).href
      })

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

export default function parser(pathOrBinary, useBinary: boolean = false) {
  if (useBinary) {
    return binaryParser(pathOrBinary)
  }
  const binaryFile = fs.readFileSync(pathOrBinary, 'binary')
  return binaryParser(binaryFile)
}
