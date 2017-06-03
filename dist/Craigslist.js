'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _parameterValidator = require('parameter-validator');

var _HtmlParser = require('./HtmlParser');

var _HtmlParser2 = _interopRequireDefault(_HtmlParser);

var _SearchResult = require('./SearchResult');

var _SearchResult2 = _interopRequireDefault(_SearchResult);

var _Category = require('./enums/Category');

var _Category2 = _interopRequireDefault(_Category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @interface Post
*
* @property {string}         title
* @property {Array.<string>} imageUrls
* @property {string}         url
*/

var Craigslist = function () {
    function Craigslist(options) {
        _classCallCheck(this, Craigslist);

        (0, _parameterValidator.validate)(options, ['city'], this, { addPrefix: '_' });

        this._htmlParser = new _HtmlParser2.default();
    }

    /**
    * @param   {Object}   options
    * @param   {Category} options.category
    * @param   {string}   [options.query]
    * @returns {Promise.<Array.<SearchResult>}
    */


    _createClass(Craigslist, [{
        key: 'search',
        value: function search(options) {
            var _this = this;

            return (0, _parameterValidator.validateAsync)(options, [{
                category: function category(c) {
                    return Object.keys(_Category2.default).map(function (key) {
                        return _Category2.default[key];
                    }).includes(c);
                }
            }]).then(function (_ref) {
                var category = _ref.category;


                return (0, _requestPromiseNative2.default)({
                    uri: 'https://' + _this._city + '.craigslist.org/search/' + category,
                    qs: {
                        query: options.query || null
                    }
                });
            }).then(function (html) {
                return _this._htmlParser.parseSearchResults(html);
            });
        }

        /**
        * @param   {Object}       options
        * @param   {SearchResult} options.searchResult
        * @returns {Promise.<Post>}
        */

    }, {
        key: 'getPost',
        value: function getPost(options) {
            var _this2 = this;

            var searchResult = void 0;

            return (0, _parameterValidator.validateAsync)(options, ['searchResult']).then(function () {
                searchResult = new _SearchResult2.default(options.searchResult);
                return (0, _requestPromiseNative2.default)(searchResult.postUrl);
            }).then(function (html) {
                return _this2._htmlParser.parsePost(html, searchResult);
            });
        }
    }]);

    return Craigslist;
}();

exports.default = Craigslist;