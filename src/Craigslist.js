import request from 'request-promise-native';

class Craigslist {

    search() {

        return request('https://indianapolis.craigslist.org/search/zip');
    }
}

export default Craigslist;
