import UserRankComponent from './components/user-rank.js';
import SiteMenuComponent from './components/site-menu.js';
import SortingComponent from './components/sorting.js';
import MovieListComponent from './components/movie-list.js';
import MovieCardComponent from './components/movie-card.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import ExtraMovieListComponent from './components/extra-movie-list.js';
import MovieDetailsComponent from './components/movie-details.js';
import MovieCounterComponent from './components/movie-counter.js';

import {generateMovies} from './mock/movie.js';
import {generateFilters} from './mock/filter.js';
import {render} from './utils.js';

const MOVIE_COUNT = 22;
const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

const movies = generateMovies(MOVIE_COUNT);
const moviesCount = movies.length;
const filters = generateFilters(movies);
const watchedMoviesCount = filters.find(({name}) => name === `History`).count;
const topRatedMovies = [...movies].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, 2);
const mostCommentedMovies = [...movies].sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new UserRankComponent(watchedMoviesCount).getElement());
render(siteMainElement, new SiteMenuComponent(filters).getElement());
render(siteMainElement, new SortingComponent().getElement());
render(siteMainElement, new MovieListComponent().getElement());

const moviePageElement = siteMainElement.querySelector(`.films`);
const movieListElement = moviePageElement.querySelector(`.films-list`);
const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);

const renderMovieCard = (movieListElement, movie) => {
  const movieCardComponent = new MovieCardComponent(movie);
  const movieDetailsComponent = new MovieDetailsComponent(movie);

  const moviePosterElement = movieCardComponent.getElement().querySelector(`.film-card__poster`);
  const movieTitleElement = movieCardComponent.getElement().querySelector(`.film-card__title`);
  const movieCommentsCountElement = movieCardComponent.getElement().querySelector(`.film-card__comments`);
  /* Сохраняет все элементы, клик на которые вызывает показ попапа с подробной информацией о фильме, в массив */
  const detailsOpeners = [moviePosterElement, movieTitleElement, movieCommentsCountElement];
  /* Сохраняет кнопку закрытия попапа */
  const detailsCloseButtonElement = movieDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const onDetailsOpenerClick = () => {
    render(document.body, movieDetailsComponent.getElement());
  };

  /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
  detailsOpeners.forEach((detailsOpener) => detailsOpener.addEventListener(`click`, onDetailsOpenerClick));

  const onDetailsCloseButtonClick = () => {
    movieDetailsComponent.getElement().remove();
  };

  /* Добавляет обработчик клика, вызывающий удаление попапа с подробной информацией о фильме */
  detailsCloseButtonElement.addEventListener(`click`, onDetailsCloseButtonClick);

  render(movieListElement, movieCardComponent.getElement());
};

let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

movies
  .slice(0, showingMoviesCount)
  .forEach((movie) => {
    renderMovieCard(majorMovieListElement, movie);
  });

render(movieListElement, new ShowMoreButtonComponent().getElement());

const showMoreButtonElement = movieListElement.querySelector(`.films-list__show-more`);

showMoreButtonElement.addEventListener(`click`, () => {
  const prevMoviesCount = showingMoviesCount;
  showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

  movies
    .slice(prevMoviesCount, showingMoviesCount)
    .forEach((movie) => {
      renderMovieCard(majorMovieListElement, movie);
    });

  if (showingMoviesCount >= moviesCount) {
    showMoreButtonElement.remove();
  }
});

render(moviePageElement, new ExtraMovieListComponent(`Top rated`).getElement());
render(moviePageElement, new ExtraMovieListComponent(`Most commented`).getElement());

const [topRatedMovieListElement, mostCommentedMovieListElement] = document.querySelectorAll(`.films-list--extra .films-list__container`);

topRatedMovies.forEach((movie) => renderMovieCard(topRatedMovieListElement, movie));
mostCommentedMovies.forEach((movie) => renderMovieCard(mostCommentedMovieListElement, movie));

const footerStatisticsElement = document.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new MovieCounterComponent(moviesCount).getElement());
