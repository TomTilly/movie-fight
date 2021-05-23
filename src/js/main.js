import { fetchData, debounce } from './util';

const omdbBaseUrl = 'http://www.omdbapi.com';
const autocomplete = document.querySelector('.autocomplete');

autocomplete.innerHTML = `
  <label for="movie-1">Search for a Movie</label>
  <input type="text" name="movie-1" id="movie-1" />
  <ul class="dropdown"></ul>
`;

const input = document.querySelector('[name="movie-1"]');

const onInput = async (event) => {
  const { target } = event;
  const dropdown = target.parentElement.querySelector('.dropdown');

  if (!target.value) {
    dropdown.classList.remove('is-active');
    return;
  }

  const movies = await fetchData(omdbBaseUrl, {
    apikey: process.env.API_KEY,
    s: target.value,
  });

  // Clear old suggestions
  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }

  if (!movies.length) {
    dropdown.classList.remove('is-active');
  } else {
    dropdown.classList.add('is-active');
  }

  for (let i = 0; i < 5; i += 1) {
    if (movies[i]) {
      const movie = movies[i];
      const suggestion = document.createElement('li');
      suggestion.classList.add('suggestion');
      suggestion.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}"> ${movie.Title}`;
      dropdown.appendChild(suggestion);
    }
  }
};

input.addEventListener('input', debounce(onInput, 500));
