'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _union2 = require('lodash/union');

var _union3 = _interopRequireDefault(_union2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.binaryParser = binaryParser;
exports.default = parser;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _href = require('./href');

var _href2 = _interopRequireDefault(_href);

var _mdConverters = require('./md-converters');

var mdConverters = _interopRequireWildcard(_mdConverters);

var _nodeZip = require('node-zip');

var _nodeZip2 = _interopRequireDefault(_nodeZip);

var _toMarkdown = require('to-markdown');

var _toMarkdown2 = _interopRequireDefault(_toMarkdown);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};

var xmlParser = new _xml2js2.default.Parser();
var parseToc = function parseToc(tocObj) {
    var rootNavPoints = (0, _get3.default)(tocObj, ['ncx', 'navMap', '0', 'navPoint'], []);
    function parseNavPoint(navPoint) {
        var src = (0, _get3.default)(navPoint, ['content', '0', '$', 'src'], '');
        var label = (0, _get3.default)(navPoint, ['navLabel', '0', 'text', '0']);
        var index = parseInt((0, _get3.default)(navPoint, ['$', 'playOrder']), 10) - 1;
        var parsedSrc = (0, _href2.default)(src);
        var children = navPoint.navPoint;
        if (children) {
            children = parseNavPoints(children);
        }
        return {
            ref: parsedSrc.name,
            hash: parsedSrc.hash,
            label: label,
            index: index,
            children: children
        };
    }
    function parseNavPoints(navPoints) {
        return navPoints.map(function (point) {
            return parseNavPoint(point);
        });
    }
    return parseNavPoints(rootNavPoints);
};
var resolveContent = function resolveContent(zipPath) {
    return function (zipInstance) {
        var content = zipInstance.file(zipPath);
        if (content) {
            return (0, _toMarkdown2.default)(content.asText(), {
                converters: [mdConverters.h, mdConverters.span, mdConverters.div, mdConverters.img, mdConverters.a]
            });
        }
        return '';
    };
};
var getContentFromSpine = function getContentFromSpine(spine, root) {
    return function (zipInstance) {
        // return _(spine)
        //   .union()
        //   .map(href => ({
        //     id: parseHref(href).name,
        //     markdown: resolveContent(`${root}${href}`)(zipInstance)
        //   }))
        //   .value()
        // no chain
        return (0, _map3.default)((0, _union3.default)(spine), function (href) {
            return {
                id: (0, _href2.default)(href).name,
                markdown: resolveContent('' + root + href)(zipInstance)
            };
        });
    };
};
var extractZipContent = function extractZipContent(filepath) {
    return function (zip) {
        var file = zip.file(filepath);
        if (file) {
            return file.asText();
        } else {
            throw new Error(filepath + ' not found!');
        }
    };
};
var getOpsRoot = function getOpsRoot(opfPath) {
    var opsRoot = '';
    // set the opsRoot for resolving paths
    if (opfPath.match(/\//)) {
        opsRoot = opfPath.replace(/\/([^\/]+)\.opf/i, '');
        if (!opsRoot.match(/\/$/)) {
            opsRoot += '/';
        }
        if (opsRoot.match(/^\//)) {
            opsRoot = opsRoot.replace(/^\//, '');
        }
    }
    return opsRoot;
};
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
function binaryParser(binaryFile) {
    return __awaiter(this, void 0, void 0, _regenerator2.default.mark(function _callee2() {
        var _this = this;

        var _ret;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
                            var zip, containerXml, containerJSON, opfPath, root, contentXml, tocXml, tocJSON, parsedToc, contentJSON, metadata, title, author, manifest, spine, publisher, meta, flesh;
                            return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            zip = new _nodeZip2.default(binaryFile, { binary: true, base64: false, checkCRC32: true });
                                            containerXml = extractZipContent('META-INF/container.xml')(zip);
                                            _context.next = 4;
                                            return xmlToJs(containerXml);

                                        case 4:
                                            containerJSON = _context.sent;
                                            opfPath = containerJSON.container.rootfiles[0].rootfile[0]['$']['full-path'];
                                            root = getOpsRoot(opfPath);
                                            contentXml = extractZipContent(root + 'content.opf')(zip);
                                            tocXml = extractZipContent(root + 'toc.ncx')(zip);
                                            _context.next = 11;
                                            return xmlToJs(tocXml);

                                        case 11:
                                            tocJSON = _context.sent;
                                            parsedToc = parseToc(tocJSON);
                                            _context.next = 15;
                                            return xmlToJs(contentXml);

                                        case 15:
                                            contentJSON = _context.sent;
                                            metadata = (0, _get3.default)(contentJSON, ['package', 'metadata'], []);
                                            title = (0, _get3.default)(metadata[0], ['dc:title', 0]);
                                            author = (0, _get3.default)(metadata[0], ['dc:creator', 0]);
                                            manifest = (0, _get3.default)(contentJSON, ['package', 'manifest', 0, 'item'], []).map(function (item) {
                                                return item.$;
                                            }).map(function (item) {
                                                return {
                                                    id: item.id,
                                                    href: item.href
                                                };
                                            });
                                            spine = (0, _get3.default)(contentJSON, ['package', 'spine', 0, 'itemref'], []).map(function (item) {
                                                return item.$.idref;
                                            }).map(function (id) {
                                                return (0, _find3.default)(manifest, { id: id }).href;
                                            });

                                            if ((typeof author === 'undefined' ? 'undefined' : (0, _typeof3.default)(author)) === 'object') {
                                                author = (0, _get3.default)(author, ['_']);
                                            }
                                            publisher = (0, _get3.default)(metadata[0], ['dc:publisher', 0]);
                                            meta = {
                                                title: title,
                                                author: author,
                                                publisher: publisher
                                            };
                                            flesh = getContentFromSpine(spine, root)(zip);
                                            return _context.abrupt('return', {
                                                v: {
                                                    meta: meta,
                                                    nav: parsedToc,
                                                    flesh: flesh
                                                }
                                            });

                                        case 26:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        })(), 't0', 2);

                    case 2:
                        _ret = _context2.t0;

                        if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
                            _context2.next = 5;
                            break;
                        }

                        return _context2.abrupt('return', _ret.v);

                    case 5:
                        _context2.next = 10;
                        break;

                    case 7:
                        _context2.prev = 7;
                        _context2.t1 = _context2['catch'](0);
                        return _context2.abrupt('return', _promise2.default.reject(_context2.t1));

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 7]]);
    }));
}
function parser(target, options) {
    // seems 260 is the length limit of old windows standard
    // so path length is not used to determine whether it's path or binary string
    // the downside here is that if the filepath is incorrect, it will be treated as binary string by default
    // but it can use options to define the target type
    if (options.type === 'path' || typeof target === 'string' && _fs2.default.existsSync(target)) {
        var binaryString = _fs2.default.readFileSync(target, 'binary');
        return binaryParser(binaryString);
    } else {
        return binaryParser(target);
    }
}