import Craigslist from './src/Craigslist';
import Category from './src/enums/Category';

let craigslist = new Craigslist({ city: 'indianapolis' });

craigslist.search({
    category: Category.FREE,
    query: 'cat'
})
.then(result => {

})
.catch(error => {
    console.log(`An error occurred: ${error.name}, ${error.message}\n${error.stack}`);
});
