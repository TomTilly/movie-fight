import { fetchData } from './util';

console.log('it worked');

const omdbBaseUrl = 'http://www.omdbapi.com';

const params = {
  apikey: process.env.API_KEY,
  s: 'avengers',
};

fetchData(omdbBaseUrl, params).then((response) => {
  console.log(response);
});
