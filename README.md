# simple-epub-parser

> An easy-to-use epub parser written in TypeScript. 

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

console.log('epub content:', parser('/path/to/file.epub'))
console.log('epub content:', parser(binaryData, true))
```

### parser(pathOrBinary, useBinary?: boolean)

parser can process file referenced by path string or binary data, it treat the first parameter as path string by default (if the second parameter is not present or passed `false`). To parse binary data directly simply pass `false` to the second parameter. 

#### pathOrBinary

type: `string`

The path to the file or file's binary data

#### useBinary

type: `boolean`

Whether to treat the first parameter as binary data. If not present it will be treated as path.
