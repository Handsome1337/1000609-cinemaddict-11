import SortingComponent, {SortType} from './../components/sorting.js';
import NoMoviesComponent from './../components/no-movies.js';
import MovieCardComponent from './../components/movie-card.js';
import MovieDetailsComponent from './../components/movie-details.js';
import ShowMoreButtonComponent from './../components/show-more-button.js';
import ExtraMovieListComponent from './../components/extra-movie-list.js';
import {RenderPosition, render, remove} from './../utils/render.js';

const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIES_COUNT = 2;

const renderMovieCard = (movieListElement, movie) => {
  const movieCardComponent = new MovieCardComponent(movie);
  const movieDetailsComponent = new MovieDetailsComponent(movie);

  /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
  movieCardComponent.setOnDetailsOpenersClick(() => {
    render(document.body, movieDetailsComponent);
    /* Добавляет обработчик клика, вызывающий удаление попапа с подробной информацией о фильме */
    movieDetailsComponent.setOnCloseButtonClick(removeDetails);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const removeDetails = () => {
    remove(movieDetailsComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      removeDetails();
    }
  };

  render(movieListElement, movieCardComponent);
};

const renderMovies = (movieListElement, movies) => {
  movies.forEach((movie) => {
    renderMovieCard(movieListElement, movie);
  });
};

const getSortedMovies = (movies, sortType) => {
  let sortedMovies = [];

  switch (sortType) {
    case SortType.DATE:
      sortedMovies = [...movies].sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);
      break;
    case SortType.RATING:
      sortedMovies = [...movies].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      break;
    default:
      sortedMovies = [...movies];
  }

  return sortedMovies;
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._sortingComponent = new SortingComponent();
    this._noMoviesComponent = new NoMoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(movies) {
    const container = this._container.getElement();
    let sortedMovies = movies;

    render(container, this._sortingComponent, RenderPosition.BEFORE);

    const movieListElement = container.querySelector(`.films-list`);

    if (!movies.length) {
      render(movieListElement, this._noMoviesComponent);
      return;
    }

    const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);

    let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    renderMovies(majorMovieListElement, sortedMovies.slice(0, showingMoviesCount));

    const renderShowMoreButton = () => {
      render(movieListElement, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setOnClick(() => {
        const prevMoviesCount = showingMoviesCount;
        showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

        renderMovies(majorMovieListElement, sortedMovies.slice(prevMoviesCount, showingMoviesCount));

        if (showingMoviesCount >= movies.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    renderShowMoreButton();

    const topRatedMovies = movies.filter((movie) => movie.filmInfo.totalRating).sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, EXTRA_MOVIES_COUNT);
    const mostCommentedMovies = movies.filter((movie) => movie.comments.length).sort((a, b) => b.comments.length - a.comments.length).slice(0, EXTRA_MOVIES_COUNT);

    if (topRatedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(`Top rated`);
      render(container, extraMovieListComponent);
      renderMovies(extraMovieListComponent.getElement().querySelector(`.films-list__container`), topRatedMovies);
    }

    if (mostCommentedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(`Most commented`);
      render(container, extraMovieListComponent);
      renderMovies(extraMovieListComponent.getElement().querySelector(`.films-list__container`), mostCommentedMovies);
    }

    this._sortingComponent.setOnSortTypeChange((sortType) => {
      showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

      sortedMovies = getSortedMovies(movies, sortType);

      majorMovieListElement.innerHTML = ``;

      renderMovies(majorMovieListElement, sortedMovies.slice(0, showingMoviesCount));

      remove(this._showMoreButtonComponent);
      renderShowMoreButton();
    });
  }
}
