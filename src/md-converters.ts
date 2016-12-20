import parseHref from './href'

export const resolveInlineNavHref = href => {
  if (href && href.indexOf('http://') === -1) {
    const parsed = parseHref(href)

    if (parsed.hash) {
      return `#${parsed.name}$${parsed.hash}`
    }

    return `#${parsed.name}`
  }

  return href
}

export const h = {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

  replacement: function (innerHTML, node: HTMLElement) {
    let hLevel = node.tagName.charAt(1) as any
    let hPrefix = ''

    for (let i = 0; i < hLevel; i++) {
      hPrefix += '#'
    }

    // return `\n${hPrefix} ${innerHTML.trim()}\n\n`
    const hTag = node.tagName.toLowerCase()
    const id = node.getAttribute('id')

    if (!id) {
      return `\n${hPrefix} ${innerHTML}\n\n`
    }

    // 块级元素若保留原标签需添加换行符，否则临近元素渲染会出现问题
    return `\n<${hTag} id="${id}">${innerHTML.trim().split('\n').join(' ')}</${hTag}>\n\n`
  }
}

export const span = {
  filter: ['span'],

  replacement: function (innerHTML, node) {
    return innerHTML
  }
}

export const a = {
  filter: ['a'],

  replacement: function (innerHTML, node: HTMLEmbedElement) {
    const href = node.getAttribute('href')
    return `\n[${innerHTML}](${resolveInlineNavHref(href)})\n\n`
  }
}

export const div = {
  filter: ['div'],

  replacement: function (innerHTML, node) {
    return `\n${innerHTML}\n\n`
  }
}

export const img = {
  filter: ['img'],

  replacement: function (innerHTML, node) {
    return `\n[图]\n\n`
  }
}
