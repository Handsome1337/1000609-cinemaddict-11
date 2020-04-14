import {createUserRankTemplate} from './components/user-rank.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortingTemplate} from './components/sorting.js';
import {createMovieListTemplate} from './components/movie-list.js';
import {createMovieCardTemplate} from './components/movie-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createExtraMovieListTemplate} from './components/extra-movie-list.js';
import {createMovieDetailsTemplate} from './components/movie-details.js';
import {createMovieCounterTemplate} from './components/movie-counter.js';

import {generateMovies} from './mock/movie.js';
import {generateFilters} from './mock/filter.js';

const MOVIE_COUNT = 22;
const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

const movies = generateMovies(MOVIE_COUNT);
const moviesCount = movies.length;
const filters = generateFilters(movies);
const topRatedMovies = [...movies].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, 2);
const mostCommentedMovies = [...movies].sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createElement(createUserRankTemplate(moviesCount)));
render(siteMainElement, createElement(createSiteMenuTemplate(filters)));
render(siteMainElement, createElement(createSortingTemplate()));
render(siteMainElement, createElement(createMovieListTemplate()));

const moviePageElement = siteMainElement.querySelector(`.films`);
const movieListElement = moviePageElement.querySelector(`.films-list`);
const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);

let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

movies
  .slice(0, showingMoviesCount)
  .forEach((movie) => {
    render(majorMovieListElement, createElement(createMovieCardTemplate(movie)));
  });

render(movieListElement, createElement(createShowMoreButtonTemplate()));

const showMoreButtonElement = movieListElement.querySelector(`.films-list__show-more`);

showMoreButtonElement.addEventListener(`click`, () => {
  const prevMoviesCount = showingMoviesCount;
  showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

  movies
    .slice(prevMoviesCount, showingMoviesCount)
    .forEach((movie) => {
      render(majorMovieListElement, createElement(createMovieCardTemplate(movie)));
    });

  if (showingMoviesCount >= moviesCount) {
    showMoreButtonElement.remove();
  }
});

render(moviePageElement, createElement(createExtraMovieListTemplate(`Top rated`)));
render(moviePageElement, createElement(createExtraMovieListTemplate(`Most commented`)));

const [topRatedMovieListElement, mostCommentedMovieListElement] = document.querySelectorAll(`.films-list--extra .films-list__container`);

topRatedMovies.forEach((movie) => render(topRatedMovieListElement, createElement(createMovieCardTemplate(movie))));
mostCommentedMovies.forEach((movie) => render(mostCommentedMovieListElement, createElement(createMovieCardTemplate(movie))));

const footerStatisticsElement = document.querySelector(`.footer__statistics`);

render(footerStatisticsElement, createElement(createMovieCounterTemplate(moviesCount)));

render(document.body, createElement(createMovieDetailsTemplate(movies[0])));
