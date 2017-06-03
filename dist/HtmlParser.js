'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SEARCH_ROW_SELECTOR = '.result-row',
    SEARCH_TITLE_SELECTOR = '.result-title',
    SEARCH_IMAGE_SELECTOR = '.result-image',
    POST_TITLE_SELECTOR = '#titletextonly',
    POST_LOCATION_SELECTOR = '.postingtitle small',
    POST_DESCRIPTION_SELECTOR = '#postingbody';

var HtmlParser = function () {
    function HtmlParser() {
        _classCallCheck(this, HtmlParser);
    }

    _createClass(HtmlParser, [{
        key: 'parsePost',


        /**
        * @param   {string}       html
        * @param   {SearchResult} searchResult
        * @returns {Post}
        * @private
        */
        value: function parsePost(html, _ref) {
            var postUrl = _ref.postUrl,
                imageUrls = _ref.imageUrls;


            return {
                url: postUrl,
                imageUrls: imageUrls,
                title: (0, _cheerio2.default)(POST_TITLE_SELECTOR, html).text(),
                location: this._removeParentheses((0, _cheerio2.default)(POST_LOCATION_SELECTOR, html).text()),
                description: (0, _cheerio2.default)(POST_DESCRIPTION_SELECTOR, html)[0].children[2].data
            };
        }

        /**
        * @param {string} html
        * @returns {Array.<SearchResult>}
        * @private
        */

    }, {
        key: 'parseSearchResults',
        value: function parseSearchResults(html) {
            var _this = this;

            var resultsPageUrl = (0, _cheerio2.default)('link[rel="canonical"]', html).attr('href'),
                resultRows = Array.from((0, _cheerio2.default)(SEARCH_ROW_SELECTOR, html)),
                results = resultRows.map(function (row) {
                return _this._parseResultRow(row, resultsPageUrl);
            });

            return results;
        }

        /**
        * @param {Object} resultRow - Cheerio object
        * @private
        */

    }, {
        key: '_parseResultRow',
        value: function _parseResultRow(resultRow, resultsPageUrl) {

            var titleAnchor = (0, _cheerio2.default)(SEARCH_TITLE_SELECTOR, resultRow),
                title = titleAnchor.text(),
                postUrlPath = titleAnchor.attr('href'),
                postUrl = _url2.default.resolve(resultsPageUrl, postUrlPath);

            var _url$parse = _url2.default.parse(resultsPageUrl),
                protocol = _url$parse.protocol,
                hostname = _url$parse.hostname,
                domains = hostname.split('.'),
                hostnameWithoutSubdomain = domains.slice(1).join('.');
            // Image element example:
            // <a href="/zip/6149737711.html" class="result-image gallery" data-ids="1:00303_flnorkopCoL,1:00Y0Y_55JFI78MykD,1:00R0R_eU9JQpQHNoR">


            var imageElement = (0, _cheerio2.default)(SEARCH_IMAGE_SELECTOR, resultRow)[0],
                serializedIds = (0, _cheerio2.default)(imageElement).data('ids') || '',
                imageIds = serializedIds.split(',').map(function (numberPlusId) {
                return numberPlusId.split(':')[1];
            }),

            // The thumbnails on the page are actually 300x300, but let's go ahead and get the larger versions.
            imageUrls = imageIds.map(function (id) {
                return protocol + '//images.' + hostnameWithoutSubdomain + '/' + id + '_600x450.jpg';
            });

            return {
                title: title,
                postUrl: postUrl,
                imageUrls: imageUrls
            };
        }

        /**
        * If the text is surrounded parens, it removes them.
        * @private
        */

    }, {
        key: '_removeParentheses',
        value: function _removeParentheses(text) {
            text = text.trim();
            return text[0] === '(' && text[text.length - 1] === ')' ? text.slice(1, text.length - 1) : text;
        }
    }]);

    return HtmlParser;
}();

exports.default = HtmlParser;