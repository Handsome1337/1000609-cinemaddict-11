import UserRankComponent from './components/user-rank.js';
import SiteMenuComponent from './components/site-menu.js';
import SortingComponent from './components/sorting.js';
import MovieListComponent from './components/movie-list.js';
import NoMoviesComponent from './components/no-movies.js';
import MovieCardComponent from './components/movie-card.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import ExtraMovieListComponent from './components/extra-movie-list.js';
import MovieDetailsComponent from './components/movie-details.js';
import MovieCounterComponent from './components/movie-counter.js';

import {generateMovies} from './mock/movie.js';
import {generateFilters} from './mock/filter.js';
import {render} from './utils/render.js';

const MOVIE_COUNT = 22;
const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

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
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
  detailsOpeners.forEach((detailsOpener) => detailsOpener.addEventListener(`click`, onDetailsOpenerClick));

  const removeDetails = () => {
    movieDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onDetailsCloseButtonClick = () => {
    removeDetails();
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      removeDetails();
    }
  };

  /* Добавляет обработчик клика, вызывающий удаление попапа с подробной информацией о фильме */
  detailsCloseButtonElement.addEventListener(`click`, onDetailsCloseButtonClick);

  render(movieListElement, movieCardComponent.getElement());
};

const renderMovies = (movieListComponent, movies) => {
  const movieListElement = movieListComponent.getElement().querySelector(`.films-list`);

  if (!movies.length) {
    render(movieListElement, new NoMoviesComponent().getElement());
    return;
  }

  const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);

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

    if (showingMoviesCount >= movies.length) {
      showMoreButtonElement.remove();
    }
  });

  const topRatedMovies = [...movies].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, 2);
  const mostCommentedMovies = [...movies].sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);

  render(movieListComponent.getElement(), new ExtraMovieListComponent(`Top rated`).getElement());
  render(movieListComponent.getElement(), new ExtraMovieListComponent(`Most commented`).getElement());

  const [topRatedMovieListElement, mostCommentedMovieListElement] = document.querySelectorAll(`.films-list--extra .films-list__container`);

  topRatedMovies.forEach((movie) => renderMovieCard(topRatedMovieListElement, movie));
  mostCommentedMovies.forEach((movie) => renderMovieCard(mostCommentedMovieListElement, movie));
};

const movies = generateMovies(MOVIE_COUNT);
const moviesCount = movies.length;
const filters = generateFilters(movies);
const watchedMoviesCount = filters.find(({name}) => name === `History`).count;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new UserRankComponent(watchedMoviesCount).getElement());
render(siteMainElement, new SiteMenuComponent(filters).getElement());
render(siteMainElement, new SortingComponent().getElement());

const movieListComponent = new MovieListComponent(moviesCount);
render(siteMainElement, movieListComponent.getElement());

renderMovies(movieListComponent, movies);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new MovieCounterComponent(moviesCount).getElement());
