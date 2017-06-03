import { validate } from 'parameter-validator';

/**
* @interface SearchResult
*
* @property {string}         title
* @property {Array.<string>} imageUrls
* @property {string}         postUrl
*/
class SearchResult {

    constructor(options) {

        validate(options, [ 'title', 'imageUrls', 'postUrl' ], this);
    }
}

export default SearchResult;
