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
  if (target.value !== '') {
    const movies = await fetchData(omdbBaseUrl, {
      apikey: process.env.API_KEY,
      s: target.value,
    });

    const dropdown = target.parentElement.querySelector('.dropdown');
    dropdown.classList.add('is-active');

    // Clear old suggestions
    while (dropdown.firstChild) {
      dropdown.removeChild(dropdown.firstChild);
    }

    for (let i = 0; i < 5; i += 1) {
      if (movies[i]) {
        console.log(movies[i]);
        const movie = movies[i];
        const suggestion = document.createElement('li');
        suggestion.classList.add('suggestion');
        suggestion.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}" width="68" height="100"> ${movie.Title}`;
        dropdown.appendChild(suggestion);
      }
    }
  }
};

input.addEventListener('input', debounce(onInput, 500));
