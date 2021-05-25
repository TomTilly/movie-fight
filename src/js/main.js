import axios from 'axios';
import createAutoComplete from './autocomplete';

const omdbBaseUrl = 'http://www.omdbapi.com';

const movieTemplate = (movieDetail) => {
  const imgHTML =
    movieDetail.Poster === 'N/A'
      ? ''
      : `<img src="${movieDetail.Poster}" alt="${movieDetail.Title} Poster">`;
  return `
      <header class="${movieDetail.Poster === 'N/A' ? '' : 'has-image'}">
        ${imgHTML}
        <h2 class="movie-title">${movieDetail.Title}</h2>
        <p class="tagline">${movieDetail.Plot}</p>
      </header>
      <div class="statistic">
        <p>${movieDetail.BoxOffice}</p>
        <label>Box Office</label>
      </div>
      <div class="statistic">
        <p>${movieDetail.imdbRating}</p>
        <label>Critic Rating</label>
      </div>
  `;
};

const onMovieSelect = async (movie, autocompleteEl) => {
  const response = await axios.get(omdbBaseUrl, {
    params: {
      apikey: process.env.API_KEY,
      i: movie.imdbID,
    },
  });

  const col = autocompleteEl.parentElement;
  let movieEl;
  if (!col.querySelector('.movie-details')) {
    movieEl = document.createElement('div');
    movieEl.classList.add('movie-details');
    col.appendChild(movieEl);
  } else {
    movieEl = col.querySelector('.movie-details');
  }

  movieEl.innerHTML = movieTemplate(response.data);
};

const autocompletes = document.querySelectorAll('.autocomplete');

autocompletes.forEach((el) => {
  createAutoComplete({
    root: el,
    renderOption(movie) {
      const imgHTML =
        movie.Poster === 'N/A'
          ? ''
          : `<img src="${movie.Poster}" alt="${movie.Title}">`;
      return `${imgHTML}${movie.Title}`;
    },
    onOptionSelect(movie) {
      onMovieSelect(movie, el);
    },
    inputValue(movie) {
      return movie.Title;
    },
    async fetchData(searchTerm) {
      const response = await axios.get(omdbBaseUrl, {
        params: {
          apikey: process.env.API_KEY,
          s: searchTerm,
        },
      });

      if (response.data.Error) {
        return [];
      }

      return response.data.Search;
    },
    id: 'movie-1',
  });
});
