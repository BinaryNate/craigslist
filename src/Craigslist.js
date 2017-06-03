import request from 'request-promise-native';
import { validate, validateAsync } from 'parameter-validator';
import HtmlParser from './HtmlParser';
import Category from './enums/Category';

/**
* @interface SearchResult
*
* @property {string}         title
* @property {Array.<string>} thumbnailUrls
* @property {string}         postUrl
*/

/**
* @interface Post
*
* @property {string}         title
* @property {Array.<string>} imageUrls
* @property {string}         url
*/

class Craigslist {

    constructor(options) {

        validate(options, [
            'city'
        ], this, { addPrefix: '_' });

        this._htmlParser = new HtmlParser();
    }

    /**
    * @param   {Object}   options
    * @param   {Category} options.category
    * @param   {string}   [options.query]
    * @returns {Promise.<Array.<SearchResult>}
    */
    search(options) {

        return validateAsync(options, [{
            category: c => Object.keys(Category).map(key => Category[key]).includes(c)
        }])
        .then(({ category }) => {

            return request({
                uri: `https://${this._city}.craigslist.org/search/${category}`,
                qs: {
                    query: options.query || null
                }
            });
        })
        .then(html => this._htmlParser.parseSearchResults(html));
    }

    /**
    * @param   {Object}       options
    * @param   {SearchResult} options.searchResult
    * @returns {Promise.<Post>}
    */
    getPost(options) {

        return validateAsync(options, [ 'searchResult' ])
        .then(({ searchResult }) => request(searchResult.postUrl))
        .then(html => this._htmlParser.parsePost(html));
    }
}

export default Craigslist;
