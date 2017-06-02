import Craigslist from './src/Craigslist';

let craigslist = new Craigslist();

craigslist.search()
.then(result => {
    debugger;
})
.catch(error => {
    console.log(`An error occurred: ${error.name}, ${error.message}\n${error.stack}`);
});
