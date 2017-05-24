interface GeneralObject {
  [key: string]: any
}

interface ParsedNode {
  tag?: string
  type: 1 | 3
  text?: string
  children?: ParsedNode[]
  attrs: {
    tagId: string
    href: string
    src: string
  }
}
