import { fetchData, debounce } from './util';

const omdbBaseUrl = 'http://www.omdbapi.com';
const input1 = document.querySelector('[name="movie-1"]');

const onInput = async (event) => {
  const { target } = event;
  if (target.value !== '') {
    const movies = await fetchData(omdbBaseUrl, {
      apikey: process.env.API_KEY,
      s: target.value,
    });
    let suggestions = target.parentElement.querySelector(
      '.suggestions-container'
    );
    if (!suggestions) {
      suggestions = document.createElement('ul');
      suggestions.classList.add('suggestions-container');
      target.parentElement.appendChild(suggestions);
    }
    suggestions.innerHTML = '';
    for (let i = 0; i < 5; i += 1) {
      const movie = movies[i];
      const suggestion = document.createElement('li');
      suggestion.classList.add('suggestion');
      suggestion.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}"> ${movie.Title}`;
      suggestions.appendChild(suggestion);
    }
  }
};

input1.addEventListener('input', debounce(onInput, 500));
