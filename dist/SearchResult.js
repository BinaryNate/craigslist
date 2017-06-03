'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @interface SearchResult
*
* @property {string}         title
* @property {Array.<string>} imageUrls
* @property {string}         postUrl
*/
var SearchResult = function SearchResult(options) {
    _classCallCheck(this, SearchResult);

    (0, _parameterValidator.validate)(options, ['title', 'imageUrls', 'postUrl'], this);
};

exports.default = SearchResult;