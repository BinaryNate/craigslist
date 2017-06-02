import request from 'request-promise-native';
import { validate, validateAsync } from 'parameter-validator';
import Category from './enums/Category';

class Craigslist {

    constructor(options) {

        validate(options, [
            'city'
        ], this, { addPrefix: '_' });
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

            let categoryCode = Category[category];

            return request(`https://${this._city}.craigslist.org/search/${categoryCode}`, {
                qs: {
                    query: options.query || null
                }
            });
        });
    }
}

export default Craigslist;
