'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.img = exports.div = exports.a = exports.span = exports.h = exports.resolveInlineNavHref = undefined;

var _href = require('./href');

var _href2 = _interopRequireDefault(_href);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolveInlineNavHref = exports.resolveInlineNavHref = function resolveInlineNavHref(href) {
    if (href && href.indexOf('http://') === -1) {
        var parsed = (0, _href2.default)(href);
        if (parsed.hash) {
            return '#' + parsed.name + '$' + parsed.hash;
        }
        return '#' + parsed.name;
    }
    return href;
};
var h = exports.h = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: function replacement(innerHTML, node) {
        var hLevel = node.tagName.charAt(1);
        var hPrefix = '';
        for (var i = 0; i < hLevel; i++) {
            hPrefix += '#';
        }
        // return `\n${hPrefix} ${innerHTML.trim()}\n\n`
        var hTag = node.tagName.toLowerCase();
        var id = node.getAttribute('id');
        if (!id) {
            return '\n' + hPrefix + ' ' + innerHTML + '\n\n';
        }
        // 块级元素若保留原标签需添加换行符，否则临近元素渲染会出现问题
        return '\n<' + hTag + ' id="' + id + '">' + innerHTML.trim().split('\n').join(' ') + '</' + hTag + '>\n\n';
    }
};
var span = exports.span = {
    filter: ['span'],
    replacement: function replacement(innerHTML, node) {
        return innerHTML;
    }
};
var a = exports.a = {
    filter: ['a'],
    replacement: function replacement(innerHTML, node) {
        var href = node.getAttribute('href');
        return '\n[' + innerHTML + '](' + resolveInlineNavHref(href) + ')\n\n';
    }
};
var div = exports.div = {
    filter: ['div'],
    replacement: function replacement(innerHTML, node) {
        return '\n' + innerHTML + '\n\n';
    }
};
var img = exports.img = {
    filter: ['img'],
    replacement: function replacement(innerHTML, node) {
        return '\n[\u56FE]\n\n';
    }
};