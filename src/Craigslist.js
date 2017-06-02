import request from 'request-promise-native';
import { validate, validateAsync } from 'parameter-validator';
import HtmlParser from './HtmlParser';
import Category from './enums/Category';

class Craigslist {

    constructor(options) {

        validate(options, [
            'city'
        ], this, { addPrefix: '_' });

        this._htmlParser = new HtmlParser();
    }

    /**
    * @param   {Object}          options
    * @param   {Category}        options.category
    * @param   {string}          [options.query]
    * @returns {Promise.<Array>} results
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

}

export default Craigslist;
