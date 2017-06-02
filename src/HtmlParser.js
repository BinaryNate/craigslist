import $ from 'cheerio';
import url from 'url';

/**
* @interface SearchResult
*
* @property {string} title
* @property {string} thumbnailUrls
* @property {string} pageUri
*/

const ROW_SELECTOR = '.result-row',
      TITLE_SELECTOR = '.result-title',
      IMAGE_SELECTOR = '.result-image';

export default class HtmlParser {

    /**
    * @param {string} html
    * @returns {Array.<SearchResult>}
    * @private
    */
    parseSearchResults(html) {

        let resultsPageUrl = $('link[rel="canonical"]', html).attr('href'),
            resultRows = Array.from($(ROW_SELECTOR, html)),
            results = resultRows.map(row => this._parseResultRow(row, resultsPageUrl));

        return results;
    }

    /**
    * @param {Object} resultRow - Cheerio object
    * @private
    */
    _parseResultRow(resultRow, resultsPageUrl) {

        let titleAnchor = $(TITLE_SELECTOR, resultRow),
            title = titleAnchor.text(),
            pageUrlPath = titleAnchor.attr('href'),
            pageUrl = url.resolve(resultsPageUrl, pageUrlPath);


        let { protocol, hostname } = url.parse(resultsPageUrl),
            domains = hostname.split('.'),
            hostnameWithoutSubdomain = domains.slice(1).join('.');
        // Image element example:
        // <a href="/zip/6149737711.html" class="result-image gallery" data-ids="1:00303_flnorkopCoL,1:00Y0Y_55JFI78MykD,1:00R0R_eU9JQpQHNoR">
        let imageElement = $(IMAGE_SELECTOR, resultRow)[0],
            serializedIds = $(imageElement).data('ids') || '',
            imageIds = serializedIds.split(',').map(numberPlusId => numberPlusId.split(':')[1]),
            thumbnailUrls = imageIds.map(id => `${protocol}//images.${hostnameWithoutSubdomain}/${id}_300x300.jpg`);

        return {
            title,
            pageUrl,
            thumbnailUrls
        };
    }
}
