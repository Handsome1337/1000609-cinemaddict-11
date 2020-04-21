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

    this._movies = [];
    this._sortedMovies = [];
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
    this._sortingComponent = new SortingComponent();
    this._noMoviesComponent = new NoMoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortingComponent.setOnSortTypeChange(this._onSortTypeChange);
  }

  render(movies) {
    this._movies = movies;
    this._sortedMovies = movies;

    const container = this._container.getElement();

    render(container, this._sortingComponent, RenderPosition.BEFORE);

    const movieListElement = container.querySelector(`.films-list`);

    if (!this._movies.length) {
      render(movieListElement, this._noMoviesComponent);
      return;
    }

    const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);

    renderMovies(majorMovieListElement, this._sortedMovies.slice(0, this._showingMoviesCount));

    this._renderShowMoreButton();

    const topRatedMovies = this._movies.filter((movie) => movie.filmInfo.totalRating).sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, EXTRA_MOVIES_COUNT);
    const mostCommentedMovies = this._movies.filter((movie) => movie.comments.length).sort((a, b) => b.comments.length - a.comments.length).slice(0, EXTRA_MOVIES_COUNT);

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
  }

  _renderShowMoreButton() {
    const movieListElement = this._container.getElement().querySelector(`.films-list`);
    render(movieListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setOnClick(() => {
      const prevMoviesCount = this._showingMoviesCount;
      const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);
      this._showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

      renderMovies(majorMovieListElement, this._sortedMovies.slice(prevMoviesCount, this._showingMoviesCount));

      if (this._showingMoviesCount >= this._movies.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    this._sortedMovies = getSortedMovies(this._movies, sortType);
    const majorMovieListElement = this._container.getElement().querySelector(`.films-list__container`);

    majorMovieListElement.innerHTML = ``;

    renderMovies(majorMovieListElement, this._sortedMovies.slice(0, this._showingMoviesCount));

    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton();
  }
}
