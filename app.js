import Craigslist from './src/Craigslist';
import Category from './src/enums/Category';

let cl = new Craigslist({ city: 'indianapolis' });

cl.search({
    category: Category.FREE,
    query: 'cat'
})
.then(searchResults => {
    debugger;
    return cl.getPost({ searchResult: searchResults[0] });
})
.then(post => {
    debugger;
})
.catch(error => {
    console.log(`An error occurred: ${error.name}, ${error.message}\n${error.stack}`);
});
