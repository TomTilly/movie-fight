import { fetchData } from './util';

const omdbBaseUrl = 'http://www.omdbapi.com';
const input1 = document.querySelector('[name="movie-1"]');

let interval;
input1.addEventListener('input', (event) => {
  if (interval) clearInterval(interval);
  if (event.target.value !== '') {
    interval = setTimeout(() => {
      fetchData(omdbBaseUrl, {
        apikey: process.env.API_KEY,
        s: event.target.value,
      }).then((response) => {
        console.log(response);
      });
    }, 500);
  }
});
