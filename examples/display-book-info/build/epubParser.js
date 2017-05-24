require('source-map-support').install()
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _last2 = __webpack_require__(27);

var _last3 = _interopRequireDefault(_last2);

exports.default = parseLink;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseLink(href) {
    var hash = href.split('#')[1];
    var url = href.split('#')[0];
    var prefix = url.split('/').slice(0, -1).join('/');
    var filename = (0, _last3.default)(url.split('/'));
    var name = filename.split('.').slice(0, -1).join('.');
    var ext = (0, _last3.default)(filename.split('.'));
    if (filename.indexOf('.') === -1) {
        ext = '';
    }
    return { hash: hash, name: name, ext: ext, prefix: prefix, url: url };
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function(){
  var crypt = __webpack_require__(16),
      utf8 = __webpack_require__(1).utf8,
      isBuffer = __webpack_require__(18),
      bin = __webpack_require__(1).bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _epubParser = __webpack_require__(8);

var _epubParser2 = _interopRequireDefault(_epubParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _epubParser2.default;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Epub = undefined;

var _regenerator = __webpack_require__(15);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = __webpack_require__(4);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(5);

var _createClass3 = _interopRequireDefault(_createClass2);

var _typeof2 = __webpack_require__(14);

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = __webpack_require__(12);

var _promise2 = _interopRequireDefault(_promise);

var _forEach2 = __webpack_require__(22);

var _forEach3 = _interopRequireDefault(_forEach2);

var _union2 = __webpack_require__(30);

var _union3 = _interopRequireDefault(_union2);

var _map2 = __webpack_require__(28);

var _map3 = _interopRequireDefault(_map2);

var _find2 = __webpack_require__(20);

var _find3 = _interopRequireDefault(_find2);

var _get2 = __webpack_require__(23);

var _get3 = _interopRequireDefault(_get2);

exports.default = parserWrapper;

var _fs = __webpack_require__(17);

var _fs2 = _interopRequireDefault(_fs);

var _xml2js = __webpack_require__(33);

var _xml2js2 = _interopRequireDefault(_xml2js);

var _nodeZip = __webpack_require__(31);

var _nodeZip2 = _interopRequireDefault(_nodeZip);

var _md = __webpack_require__(2);

var _md2 = _interopRequireDefault(_md);

var _link = __webpack_require__(0);

var _link2 = _interopRequireDefault(_link);

var _parseSection = __webpack_require__(10);

var _parseSection2 = _interopRequireDefault(_parseSection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var xmlParser = new _xml2js2.default.Parser();
var xmlToJs = function xmlToJs(xml) {
    return new _promise2.default(function (resolve, reject) {
        xmlParser.parseString(xml, function (err, object) {
            if (err) {
                reject(err);
            } else {
                resolve(object);
            }
        });
    });
};
var determineRoot = function determineRoot(opfPath) {
    var root = '';
    // set the opsRoot for resolving paths
    if (opfPath.match(/\//)) {
        root = opfPath.replace(/\/([^\/]+)\.opf/i, '');
        if (!root.match(/\/$/)) {
            root += '/';
        }
        if (root.match(/^\//)) {
            root = root.replace(/^\//, '');
        }
    }
    return root;
};
var parseMetadata = function parseMetadata(metadata) {
    var title = (0, _get3.default)(metadata[0], ['dc:title', 0]);
    var author = (0, _get3.default)(metadata[0], ['dc:creator', 0]);
    if ((typeof author === 'undefined' ? 'undefined' : (0, _typeof3.default)(author)) === 'object') {
        author = (0, _get3.default)(author, ['_']);
    }
    var publisher = (0, _get3.default)(metadata[0], ['dc:publisher', 0]);
    var meta = {
        title: title,
        author: author,
        publisher: publisher
    };
    return meta;
};

var Epub = exports.Epub = function () {
    function Epub(buffer) {
        (0, _classCallCheck3.default)(this, Epub);

        this._zip = new _nodeZip2.default(buffer, { binary: true, base64: false, checkCRC32: true });
    }

    (0, _createClass3.default)(Epub, [{
        key: 'resolve',
        value: function resolve(path) {
            var _path = void 0;
            if (path[0] === '/') {
                // use absolute path, root is zip root
                _path = path.substr(1);
            } else {
                _path = this._root + path;
            }
            var file = this._zip.file(_path);
            if (file) {
                return file;
            } else {
                throw new Error(path + ' not found!');
            }
        }
    }, {
        key: '_resolveXMLAsJsObject',
        value: function _resolveXMLAsJsObject(path) {
            return __awaiter(this, void 0, void 0, _regenerator2.default.mark(function _callee() {
                var xml;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                xml = this.resolve(path).asText();
                                return _context.abrupt('return', xmlToJs(xml));

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: '_getOpfPath',
        value: function _getOpfPath() {
            return __awaiter(this, void 0, void 0, _regenerator2.default.mark(function _callee2() {
                var container, opfPath;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._resolveXMLAsJsObject('/META-INF/container.xml');

                            case 2:
                                container = _context2.sent;
                                opfPath = container.container.rootfiles[0].rootfile[0]['$']['full-path'];
                                return _context2.abrupt('return', opfPath);

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: '_genStructure',
        value: function _genStructure(tocObj) {
            var _this = this;

            var rootNavPoints = (0, _get3.default)(tocObj, ['ncx', 'navMap', '0', 'navPoint'], []);
            var parseNavPoint = function parseNavPoint(navPoint) {
                // link to section
                var link = (0, _get3.default)(navPoint, ['content', '0', '$', 'src'], '');
                // const name = _.get(navPoint, ['navLabel', '0', 'text', '0'])
                var playOrder = (0, _get3.default)(navPoint, ['$', 'playOrder']);
                // const parsedSrc = parseLink(src)
                var children = navPoint.navPoint;
                if (children) {
                    // tslint:disable-next-line:no-use-before-declare
                    children = parseNavPoints(children);
                }
                var sectionId = _this._resolveIdFromLink(link);
                return {
                    sectionId: sectionId,
                    // srcObject: parsedSrc,
                    // name,
                    playOrder: playOrder,
                    children: children
                };
            };
            var parseNavPoints = function parseNavPoints(navPoints) {
                return navPoints.map(function (point) {
                    return parseNavPoint(point);
                });
            };
            return parseNavPoints(rootNavPoints);
        }
    }, {
        key: '_getManifest',
        value: function _getManifest() {
            return (0, _get3.default)(this._content, ['package', 'manifest', 0, 'item'], []).map(function (item) {
                return item.$;
            });
        }
    }, {
        key: '_resolveIdFromLink',
        value: function _resolveIdFromLink(href) {
            var _parseLink = (0, _link2.default)(href),
                tarName = _parseLink.name;

            var tarItem = (0, _find3.default)(this.manifest, function (item) {
                var _parseLink2 = (0, _link2.default)(item.href),
                    name = _parseLink2.name;

                return name === tarName;
            });
            var id = (0, _get3.default)(tarItem, 'id', '');
            if (id) {
                return (0, _md2.default)(id);
            }
            return null;
        }
    }, {
        key: '_getSpine',
        value: function _getSpine() {
            return (0, _get3.default)(this._content, ['package', 'spine', 0, 'itemref'], []).map(function (item) {
                return item.$.idref;
            });
        }
    }, {
        key: '_resolveSectionsFromSpine',
        value: function _resolveSectionsFromSpine() {
            var _this2 = this;

            // no chain
            return (0, _map3.default)((0, _union3.default)(this._spine), function (id) {
                var path = (0, _find3.default)(_this2.manifest, { id: id }).href;
                // const pathObject = parseLink(path)
                var html = _this2.resolve(path).asText();
                return (0, _parseSection2.default)({
                    id: id,
                    htmlString: html,
                    resourceResolver: _this2.resolve.bind(_this2),
                    idResolver: _this2._resolveIdFromLink.bind(_this2)
                });
            });
        }
    }, {
        key: 'parse',
        value: function parse() {
            return __awaiter(this, void 0, void 0, _regenerator2.default.mark(function _callee3() {
                var _this3 = this;

                var opfPath, tocID, tocPath, isPrivateProp;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this._getOpfPath();

                            case 2:
                                opfPath = _context3.sent;

                                this._root = determineRoot(opfPath);
                                _context3.next = 6;
                                return this._resolveXMLAsJsObject(opfPath);

                            case 6:
                                this._content = _context3.sent;

                                this.manifest = this._getManifest();
                                this._spine = this._getSpine();
                                tocID = (0, _get3.default)(this._content, ['package', 'spine', 0, '$', 'toc']);
                                tocPath = (0, _find3.default)(this.manifest, { id: tocID }).href;
                                _context3.next = 13;
                                return this._resolveXMLAsJsObject(tocPath);

                            case 13:
                                this._toc = _context3.sent;

                                this.structure = this._genStructure(this._toc);
                                this._metadata = (0, _get3.default)(this._content, ['package', 'metadata'], []);
                                this.metadata = parseMetadata(this._metadata);
                                this.sections = this._resolveSectionsFromSpine();
                                // remove private member vars

                                isPrivateProp = function isPrivateProp(key) {
                                    if (key.length > 1) {
                                        if (key[0] === '_' && key[1] !== '_') {
                                            return true;
                                        }
                                        return false;
                                    }
                                    return false;
                                };

                                (0, _forEach3.default)(this, function (val, key) {
                                    if (isPrivateProp(key)) {
                                        delete _this3[key];
                                    }
                                });
                                return _context3.abrupt('return', this);

                            case 21:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        }
    }]);
    return Epub;
}();

function parserWrapper(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // seems 260 is the length limit of old windows standard
    // so path length is not used to determine whether it's path or binary string
    // the downside here is that if the filepath is incorrect, it will be treated as binary string by default
    // but it can use options to define the target type
    var _target = target;
    if (options.type === 'path' || typeof target === 'string' && _fs2.default.existsSync(target)) {
        _target = _fs2.default.readFileSync(target, 'binary');
    }
    return new Epub(_target).parse();
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = __webpack_require__(3);

var _assign2 = _interopRequireDefault(_assign);

var _isEmpty2 = __webpack_require__(26);

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _flattenDeep2 = __webpack_require__(21);

var _flattenDeep3 = _interopRequireDefault(_flattenDeep2);

var _jsdom = __webpack_require__(19);

var _jsdom2 = _interopRequireDefault(_jsdom);

var _utils = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = __webpack_require__(6)('readr:html');
var OMITTED_TAGS = ['head', 'input', 'textarea', 'script', 'style', 'svg'];
var UNWRAP_TAGS = ['body', 'html', 'div', 'span'];
var PICKED_ATTRS = ['href', 'src', 'id'];
/**
 * recursivelyReadParent
 * @param node
 * @param callback runs the matching logic return the new node if true, if not return false, and the loop continues
 * @param final callback when reaching the root
 */
var recursivelyReadParent = function recursivelyReadParent(node, callback, final) {
    var _read = function _read(_node) {
        var parent = _node.parentNode;
        if (parent) {
            var newNode = callback(parent);
            if (!newNode) {
                return _read(parent);
            }
            return newNode;
        } else {
            if (final) {
                return final();
            }
            return node;
        }
    };
    return _read(node);
};
var parseRawHTML = function parseRawHTML(HTMLString) {
    return _jsdom2.default.jsdom(HTMLString, {
        features: {
            FetchExternalResources: [],
            ProcessExternalResources: false
        }
    }).documentElement;
};
var parseHTMLObject = function parseHTMLObject(HTMLString) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    debug('parseHTMLObject');
    var rootNode = parseRawHTML(HTMLString);
    var resolveHref = config.resolveHref,
        resolveSrc = config.resolveSrc;
    // initial parse

    var parsed = (0, _utils.parseNestedObject)(rootNode, {
        childrenKey: 'childNodes',
        preFilter: function preFilter(node) {
            return node.nodeType === 1 || node.nodeType === 3;
        },
        parser: function parser(node, children) {
            if (node.nodeType === 1) {
                var tag = node.tagName.toLowerCase();
                var attrs = {};
                if (OMITTED_TAGS.indexOf(tag) !== -1) {
                    return null;
                }
                if (UNWRAP_TAGS.indexOf(tag) !== -1) {
                    var flatten = (0, _flattenDeep3.default)(children);
                    return flatten.length === 1 ? flatten[0] : flatten;
                }
                var flatChildren = (0, _flattenDeep3.default)(children);
                // todo: join text
                // const childrenAllString = flatChildren.every(child => typeof child === 'string')
                // const joinedString = flatChildren.join(' ')
                // if (childrenAllString) {
                //   return {
                //     tag,
                //     children: joinedString ? [joinedString] : undefined
                //   }
                // }
                PICKED_ATTRS.forEach(function (attr) {
                    var attrVal = node.getAttribute(attr) || undefined;
                    if (attrVal && attr === 'href' && resolveHref) {
                        attrVal = resolveHref(attrVal);
                    }
                    if (attrVal && attr === 'src' && resolveSrc) {
                        attrVal = resolveSrc(attrVal);
                    }
                    attrs[attr] = attrVal;
                });
                return { tag: tag, type: 1, children: flatChildren, attrs: attrs };
            } else {
                var text = node.textContent.trim();
                if (!text) {
                    return null;
                }
                var makeTextObject = function makeTextObject() {
                    return {
                        parentTag: node.parentNode.tagName && node.parentNode.tagName.toLowerCase(),
                        type: 3,
                        text: text
                    };
                };
                // find the cloest parent which is not in UNWRAP_TAGS
                // if failed then wrap with p tag
                return recursivelyReadParent(node, function (parent) {
                    var tag = parent.tagName && parent.tagName.toLowerCase();
                    if (!tag || UNWRAP_TAGS.indexOf(tag) !== -1) {
                        return false;
                    }
                    return makeTextObject();
                }, function () {
                    return {
                        tag: 'p',
                        children: [makeTextObject()]
                    };
                });
            }
        },
        postFilter: function postFilter(node) {
            return !(0, _isEmpty3.default)(node);
        }
    });
    // post parse
    return (0, _utils.parseNestedObject)(parsed[0], {
        childrenKey: 'children',
        parser: function parser(object, children) {
            if (object.children) {
                return (0, _assign2.default)({}, object, {
                    children: !(0, _isEmpty3.default)(children) ? children : undefined
                });
            }
            return object;
        }
    });
};
exports.default = parseHTMLObject;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Section = undefined;

var _classCallCheck2 = __webpack_require__(4);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(5);

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = __webpack_require__(32);

var _path2 = _interopRequireDefault(_path);

var _parseHTML = __webpack_require__(9);

var _parseHTML2 = _interopRequireDefault(_parseHTML);

var _link = __webpack_require__(0);

var _link2 = _interopRequireDefault(_link);

var _md = __webpack_require__(2);

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isInternalUri = function isInternalUri(uri) {
    return uri.indexOf('http://') === -1 && uri.indexOf('https://') === -1;
};

var Section = exports.Section = function () {
    function Section(_ref) {
        var id = _ref.id,
            htmlString = _ref.htmlString,
            resourceResolver = _ref.resourceResolver,
            idResolver = _ref.idResolver;
        (0, _classCallCheck3.default)(this, Section);

        this.id = (0, _md2.default)(id);
        this.htmlString = htmlString;
        this._resourceResolver = resourceResolver;
        this._idResolver = idResolver;
    }

    (0, _createClass3.default)(Section, [{
        key: 'toHtmlObject',
        value: function toHtmlObject() {
            var _this = this;

            return (0, _parseHTML2.default)(this.htmlString, {
                resolveHref: function resolveHref(href) {
                    if (isInternalUri(href)) {
                        var _parseLink = (0, _link2.default)(href),
                            hash = _parseLink.hash;
                        // todo: what if a link only contains hash part?


                        var sectionId = _this._idResolver(href);
                        if (hash) {
                            return '#' + sectionId + ',' + hash;
                        }
                        return '#' + sectionId;
                    }
                    return href;
                },
                resolveSrc: function resolveSrc(src) {
                    if (isInternalUri(src)) {
                        // todo: may have bugs
                        var absolutePath = _path2.default.resolve('/', src).substr(1);
                        var buffer = _this._resourceResolver(absolutePath).asNodeBuffer();
                        var base64 = buffer.toString('base64');
                        return 'data:image/png;base64,' + base64;
                    }
                    return src;
                }
            });
        }
    }]);
    return Section;
}();

var parseSection = function parseSection(config) {
    return new Section(config);
};
exports.default = parseSection;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseNestedObject = undefined;

var _defineProperty2 = __webpack_require__(13);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = __webpack_require__(3);

var _assign2 = _interopRequireDefault(_assign);

var _isArrayLike2 = __webpack_require__(24);

var _isArrayLike3 = _interopRequireDefault(_isArrayLike2);

var _isArrayLikeObject2 = __webpack_require__(25);

var _isArrayLikeObject3 = _interopRequireDefault(_isArrayLikeObject2);

var _omit2 = __webpack_require__(29);

var _omit3 = _interopRequireDefault(_omit2);

exports.flattenArray = flattenArray;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = __webpack_require__(6)('readr:parsers:utils');
function flattenArray(arrayOfNestedObj) {
    var childrenName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'children';

    var list = [];
    var push = function push(infoList) {
        infoList.forEach(function (item) {
            list.push((0, _omit3.default)(item, childrenName));
            if (item[childrenName]) {
                push(item[childrenName]);
            }
        });
    };
    push(arrayOfNestedObj);
    return list;
}
/**
 * parseNestedObject
 * a note about config.parser
 * 'children' is recursively parsed object and should be returned for parser to take effect
 * objects without [childrenKey] will be parsed by finalParser
 * @param _rootObject
 * @param config
 */
var parseNestedObjectWrapper = function parseNestedObjectWrapper(_rootObject, config) {
    var childrenKey = config.childrenKey,
        parser = config.parser,
        preFilter = config.preFilter,
        postFilter = config.postFilter,
        finalParser = config.finalParser;

    if (!_rootObject) {
        return [];
    }
    var parseNestedObject = function parseNestedObject(rootObject) {
        var makeArray = function makeArray() {
            if (Array.isArray(rootObject) || (0, _isArrayLikeObject3.default)(rootObject) || (0, _isArrayLike3.default)(rootObject)) {
                return rootObject;
            }
            return [rootObject];
        };
        var rootArray = makeArray();
        return Array.prototype.filter.call(rootArray, function (object) {
            if (preFilter) {
                return preFilter(object);
            }
            return true;
        }).map(function (object, index) {
            if (object[childrenKey]) {
                var children = parseNestedObject(object[childrenKey]);
                if (parser) {
                    return parser(object, children);
                }
                return (0, _assign2.default)({}, object, (0, _defineProperty3.default)({}, childrenKey, children));
            }
            if (finalParser) {
                return finalParser(object);
            }
            return object;
        }).filter(function (object) {
            if (postFilter) {
                return postFilter(object);
            }
            return true;
        });
    };
    return parseNestedObject(_rootObject);
};
var parseNestedObject = exports.parseNestedObject = parseNestedObjectWrapper;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/defineProperty");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/typeof");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("crypt");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("is-buffer");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("jsdom");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("lodash/find");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("lodash/flattenDeep");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("lodash/forEach");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("lodash/get");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("lodash/isArrayLike");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("lodash/isArrayLikeObject");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("lodash/isEmpty");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("lodash/last");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("lodash/map");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("lodash/omit");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("lodash/union");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("node-zip");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("xml2js");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ })
/******/ ]);
//# sourceMappingURL=epubParser.js.map