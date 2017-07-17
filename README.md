# 📖 epub-parser

> A powerful yet easy-to-use epub parser

[![npm version](https://badge.fury.io/js/%40gxl%2Fepub-parser.svg)](https://badge.fury.io/js/%40gxl%2Fepub-parser)
[![build state](https://api.travis-ci.org/gaoxiaoliangz/epub-parser.svg?branch=master)](https://travis-ci.org/gaoxiaoliangz/epub-parser)

The package exports a simple parser function which use epub file as input and output JavaScript object.

As it is written in TypeScript, types are already included in the package.

## Install

``` bash
npm install @gxl/epub-parser --save
```
or if you prefer yarn

``` bash
yarn install @gxl/epub-parser
```

## Usage

```js
import parser from '@gxl/epub-parser'
// if you use `require` don't forget to add `.default`
// const parser = require('simple-epub-parser').default

console.log('epub content:', parser(binaryData))
console.log('epub content:', parser('/path/to/file.epub', {
  type: 'path'
}))
```

### parser(target: string | buffer, options?: object): EpubObject

#### target

type: `string` or `buffer`

It can be the path to the file or file's binary string or buffer

#### options

type: `object`

##### type(optional): 'binaryString' | 'path' | 'buffer'

It forces the parser to treat supplied target as the defined type, if not defined the parser itself will decide how to treat the file (useful when you are not sure if the path is valid).

#### EpubObject

The output is an object which contains `structure`, `sections`, `info` along with some other properties that deals with the epub file. They start with `_`. I don't recommend using these properties, since they are subscribed to change. They are where they are simply because JavaScript don't have native private member variable support, and sometimes they are helpful for debugging.

`structure` is the parsed `toc` of epub file, they contain information about how the book is constructed.

`sections` is an array of chapters or sections under chapters, they are referred in `structure`. Each section object contains the raw html string and a few handy methods to help you with you needs. `toMarkdown` convert the current section to markdown object. `toHtmlObject` converts to html object. And a note about `src` and `href`, the `src` and `href` in raw html stay untouched, but the `toHtmlObject` method resolves `src` to base64 string, and alters `href` so that they make sense in the parsed epub. And the parsed `href` is something like `#{sectionId},{hash}`.

### One more thing

It provides some util functions as well. 

They can be used via

```js
import { parseLink, parseHTML, parseNestedObject, flattenArray } from '@gxl/epub-parser'
```

* parseLink
* parseHTML
* parseNestedObject

Docs are coming soon ...

## How to contribute

* Raise an issue in the issue section.
* PRs are the best.

❤️
