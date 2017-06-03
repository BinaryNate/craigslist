import $ from 'cheerio';
import url from 'url';

const SEARCH_ROW_SELECTOR = '.result-row',
      SEARCH_TITLE_SELECTOR = '.result-title',
      SEARCH_IMAGE_SELECTOR = '.result-image',
      POST_TITLE_SELECTOR = '#titletextonly',
      POST_LOCATION_SELECTOR = '.postingtitle small',
      POST_DESCRIPTION_SELECTOR = '#postingbody';

export default class HtmlParser {

    /**
    * @param   {string}       html
    * @param   {SearchResult} searchResult
    * @returns {Post}
    * @private
    */
    parsePost(html, { postUrl, imageUrls }) {

        return {
            url: postUrl,
            imageUrls,
            title: $(POST_TITLE_SELECTOR, html).text(),
            location: this._removeParentheses($(POST_LOCATION_SELECTOR, html).text()),
            description: $(POST_DESCRIPTION_SELECTOR, html)[0].children[2].data
        };
    }

    /**
    * @param {string} html
    * @returns {Array.<SearchResult>}
    * @private
    */
    parseSearchResults(html) {

        let resultsPageUrl = $('link[rel="canonical"]', html).attr('href'),
            resultRows = Array.from($(SEARCH_ROW_SELECTOR, html)),
            results = resultRows.map(row => this._parseResultRow(row, resultsPageUrl));

        return results;
    }

    /**
    * @param {Object} resultRow - Cheerio object
    * @private
    */
    _parseResultRow(resultRow, resultsPageUrl) {

        let titleAnchor = $(SEARCH_TITLE_SELECTOR, resultRow),
            title = titleAnchor.text(),
            postUrlPath = titleAnchor.attr('href'),
            postUrl = url.resolve(resultsPageUrl, postUrlPath);


        let { protocol, hostname } = url.parse(resultsPageUrl),
            domains = hostname.split('.'),
            hostnameWithoutSubdomain = domains.slice(1).join('.');
        // Image element example:
        // <a href="/zip/6149737711.html" class="result-image gallery" data-ids="1:00303_flnorkopCoL,1:00Y0Y_55JFI78MykD,1:00R0R_eU9JQpQHNoR">
        let imageElement = $(SEARCH_IMAGE_SELECTOR, resultRow)[0],
            serializedIds = $(imageElement).data('ids') || '',
            imageIds = serializedIds.split(',').map(numberPlusId => numberPlusId.split(':')[1]),
            // The thumbnails on the page are actually 300x300, but let's go ahead and get the larger versions.
            imageUrls = imageIds.map(id => `${protocol}//images.${hostnameWithoutSubdomain}/${id}_600x450.jpg`);

        return {
            title,
            postUrl,
            imageUrls
        };
    }

    /**
    * If the text is surrounded parens, it removes them.
    * @private
    */
    _removeParentheses(text) {
        text = text.trim();
        return (text[0] === '(' && text[text.length - 1] === ')') ? text.slice(1, text.length - 1) : text;
    }
}
