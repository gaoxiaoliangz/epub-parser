# simple-epub-parser

> An easy-to-use epub parser written in TypeScript. 

[![npm version](https://badge.fury.io/js/simple-epub-parser.svg)](https://badge.fury.io/js/simple-epub-parser)
[![build state](https://api.travis-ci.org/gaoxiaoliangz/simple-epub-parser.svg?branch=master)](https://travis-ci.org/gaoxiaoliangz/simple-epub-parser)

The package exports a simple parser function which input epub file and output as JavaScript object. The output object is consisted of `nav`, `flesh` and `meta`.

`flesh` is epub's content and it is in the format of markdown.

As it is written in TypeScript, types are already included in the package.

## Install

``` bash
npm install simple-epub-parser --save
```

## Usage

```js
import parser from 'simple-epub-parser'
// Note:
// if you use `require` don't forget to add `.default` to your import
// const parser = require('simple-epub-parser').default

console.log('epub content:', parser(binaryData))
console.log('epub content:', parser('/path/to/file.epub', {
  type: 'path'
}))
```

### parser(target: string | buffer, options?: object)

#### target

type: `string` or `buffer`

It can be the path to the file or file's binary string or buffer

#### options

type: `object`

##### type(optional): 'binaryString' | 'path' | 'buffer'

It forces the parser to treat supplied target as the defined type, if not defined the parser itself will decide how to treat the file (useful when you are not sure if the path is valid).
