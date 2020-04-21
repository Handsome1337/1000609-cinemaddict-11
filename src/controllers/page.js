import SortingComponent, {SortType} from './../components/sorting.js';
import NoMoviesComponent from './../components/no-movies.js';
import MovieController from './../controllers/movie.js';
import ShowMoreButtonComponent from './../components/show-more-button.js';
import ExtraMovieListComponent from './../components/extra-movie-list.js';
import {RenderPosition, render, remove} from './../utils/render.js';

const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIES_COUNT = 2;

const renderMovies = (movieListElement, movies) => {
  return movies.map((movie) => {
    const movieController = new MovieController(movie);

    movieController.render(movieListElement);

    return movieController;
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
    this._showedMovieControllers = [];
    this._extraMovieControllers = [];
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

    const newMovies = renderMovies(majorMovieListElement, this._sortedMovies.slice(0, this._showingMoviesCount));
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

    this._renderShowMoreButton();

    const topRatedMovies = this._movies.filter((movie) => movie.filmInfo.totalRating).sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, EXTRA_MOVIES_COUNT);
    const mostCommentedMovies = this._movies.filter((movie) => movie.comments.length).sort((a, b) => b.comments.length - a.comments.length).slice(0, EXTRA_MOVIES_COUNT);

    if (topRatedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(`Top rated`);
      render(container, extraMovieListComponent);
      const extraMovies = renderMovies(extraMovieListComponent.getElement().querySelector(`.films-list__container`), topRatedMovies);
      this._extraMovieControllers = this._extraMovieControllers.concat(extraMovies);
    }

    if (mostCommentedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(`Most commented`);
      render(container, extraMovieListComponent);
      const extraMovies = renderMovies(extraMovieListComponent.getElement().querySelector(`.films-list__container`), mostCommentedMovies);
      this._extraMovieControllers = this._extraMovieControllers.concat(extraMovies);
    }
  }

  _renderShowMoreButton() {
    const movieListElement = this._container.getElement().querySelector(`.films-list`);
    render(movieListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setOnClick(() => {
      const prevMoviesCount = this._showingMoviesCount;
      const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);
      this._showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

      const newMovies = renderMovies(majorMovieListElement, this._sortedMovies.slice(prevMoviesCount, this._showingMoviesCount));
      this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

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

    const newMovies = renderMovies(majorMovieListElement, this._sortedMovies.slice(0, this._showingMoviesCount));
    this._showedMovieControllers = newMovies;

    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton();
  }
}
