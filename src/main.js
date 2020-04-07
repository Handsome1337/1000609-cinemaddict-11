import {createUserRankTemplate} from './components/user-rank.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortingTemplate} from './components/sorting.js';
import {createMovieListTemplate} from './components/movie-list.js';
import {createMovieCardTemplate} from './components/movie-card.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createExtraMovieListTemplate} from './components/extra-movie-list.js';
// import {createMovieDetailsTemplate} from './components/movie-details.js';

import {generateMovies} from './mock/movie.js';

const MOVIE_COUNT = 22;

/* Перечисление вариантов вставки элемента */
const RenderPosition = {
  BEFOREEND: `beforeend`
};

/* В следующих заданиях добавятся другие места вставки,
поэтому использованы перечисление и switch */
const render = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    default:
      container.append(component);
  }
};

/* Возвращает DOM-элемент на основе переданной в параметр разметки шаблона */
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const movies = generateMovies(MOVIE_COUNT);
const topRatedMovies = [...movies].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, 2);
const mostCommentedMovies = [...movies].sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createElement(createUserRankTemplate()));
render(siteMainElement, createElement(createSiteMenuTemplate()));
render(siteMainElement, createElement(createSortingTemplate()));
render(siteMainElement, createElement(createMovieListTemplate()));

const moviePageElement = siteMainElement.querySelector(`.films`);
const movieListElement = moviePageElement.querySelector(`.films-list`);
const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);

movies.forEach((movie) => {
  render(majorMovieListElement, createElement(createMovieCardTemplate(movie)));
});

render(movieListElement, createElement(createShowMoreButtonTemplate()));

render(moviePageElement, createElement(createExtraMovieListTemplate(`Top rated`)));
render(moviePageElement, createElement(createExtraMovieListTemplate(`Most commented`)));

const [topRatedMovieListElement, mostCommentedMovieListElement] = document.querySelectorAll(`.films-list--extra .films-list__container`);

topRatedMovies.forEach((movie) => render(topRatedMovieListElement, createElement(createMovieCardTemplate(movie))));
mostCommentedMovies.forEach((movie) => render(mostCommentedMovieListElement, createElement(createMovieCardTemplate(movie))));

// render(document.body, createElement(createMovieDetailsTemplate()));
