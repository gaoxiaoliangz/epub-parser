'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _last2 = require('lodash/last');

var _last3 = _interopRequireDefault(_last2);

exports.default = parseHref;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseHref(href) {
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