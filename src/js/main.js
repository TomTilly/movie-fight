import axios from 'axios';
import createAutoComplete from './autocomplete';

const omdbBaseUrl = 'http://www.omdbapi.com';

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''),
    10
  );
  const metascore = parseInt(movieDetail.Metascore, 10);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''), 10);
  const awards = parseInt(
    movieDetail.Awards.split(/\D+/) // split string into an array of numbers (beginning and ending with empty strings)
      .filter((el) => el !== '') // get rid of empty string elements
      .map((el) => parseInt(el, 10)) // convert strings into numbers
      .reduce((prev, cur) => prev + cur, 0), // add all numbers together
    10
  );

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
      <div data-value="${awards}" class="statistic">
        <p>${movieDetail.Awards}</p>
        <label>Awards</label>
      </div>
      <div data-value="${dollars}" class="statistic">
        <p>${movieDetail.BoxOffice}</p>
        <label>Box Office</label>
      </div>
      <div data-value="${metascore}" class="statistic">
        <p>${movieDetail.Metascore}</p>
        <label>Metascore</label>
      </div>
      <div data-value="${imdbRating}" class="statistic">
        <p>${movieDetail.imdbRating}</p>
        <label>IMDB Rating</label>
      </div>
      <div data-value="${imdbVotes}" class="statistic">
        <p>${movieDetail.imdbVotes}</p>
        <label>IMDB Votes</label>
      </div>
  `;
};

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, autocompleteEl, side) => {
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
    movieEl.id = `${side}-movie`;
    col.appendChild(movieEl);
  } else {
    movieEl = col.querySelector('.movie-details');
  }

  movieEl.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftMovieStats = document.querySelectorAll('#left-movie .statistic');
  const rightMovieStats = document.querySelectorAll('#right-movie .statistic');

  leftMovieStats.forEach((leftStat, i) => {
    const rightStat = rightMovieStats[i];
    if (
      parseInt(leftStat.dataset.value, 10) >
      parseInt(rightStat.dataset.value, 10)
    ) {
      leftStat.classList.add('winner');
      leftStat.classList.remove('loser');
      rightStat.classList.add('loser');
      rightStat.classList.remove('winner');
    } else {
      leftStat.classList.add('loser');
      leftStat.classList.remove('winner');
      rightStat.classList.add('winner');
      rightStat.classList.remove('loser');
    }
  });
};

const autocompletes = document.querySelectorAll('.autocomplete');

autocompletes.forEach((el, i) => {
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
      document.querySelector('.tutorial').classList.add('is-hidden');
      onMovieSelect(movie, el, i === 0 ? 'left' : 'right');
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
    id: `movie-${i}`,
  });
});
