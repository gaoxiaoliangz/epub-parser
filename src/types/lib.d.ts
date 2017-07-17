interface GeneralObject {
  [key: string]: any
}

interface HtmlNode {
  tag?: string
  type: 1 | 3
  text?: string
  children?: HtmlNode[]
  attrs: {
    id: string
    href: string
    src: string
  }
}
