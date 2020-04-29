import SortingComponent, {SortType} from './../components/sorting.js';
import NoMoviesComponent from './../components/no-movies.js';
import MovieController from './../controllers/movie.js';
import ShowMoreButtonComponent from './../components/show-more-button.js';
import ExtraMovieListComponent from './../components/extra-movie-list.js';
import {RenderPosition, render, remove} from './../utils/render.js';

const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIES_COUNT = 2;

const renderMovies = (movieListElement, movies, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(movieListElement, onDataChange, onViewChange);

    movieController.render(movie);

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
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._showedMovieControllers = [];
    /* Сохраняет контроллеры фильмов из дополнительных блоков отдельно, чтобы при сортировки и сбросе _showedMovieControllers они не удалялись */
    this._extraMovieControllers = [];
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
    this._sortingComponent = new SortingComponent();
    this._sortType = SortType.DEFAULT;
    this._sortedMovies = this._moviesModel.getMovies();
    this._noMoviesComponent = new NoMoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortingComponent.setOnSortTypeChange(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const movies = this._moviesModel.getMovies();

    render(container, this._sortingComponent, RenderPosition.BEFORE);

    const movieListElement = container.querySelector(`.films-list`);

    if (!movies.length) {
      render(movieListElement, this._noMoviesComponent);
      return;
    }

    this._renderMovies(movies.slice(0, this._showingMoviesCount));

    this._renderShowMoreButton();
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  /* container передаётся в случае, если это дополнительный блок с фильмами */
  _renderMovies(movies, container) {
    const movieListElement = container || this._container.getElement().querySelector(`.films-list__container`);

    const newMovies = renderMovies(movieListElement, movies, this._onDataChange, this._onViewChange);

    if (container) {
      this._extraMovieControllers = this._extraMovieControllers.concat(newMovies);
    } else {
      this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
      this._showingMoviesCount = this._showedMovieControllers.length;
    }
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _updateMovies() {
    this._removeMovies();
    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), this._sortType);
    this._renderMovies(this._sortedMovies.slice(0, SHOWING_MOVIES_COUNT_ON_START));
    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingMoviesCount >= this._sortedMovies.length) {
      return;
    }

    const movieListElement = this._container.getElement().querySelector(`.films-list`);
    render(movieListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setOnClick(this._onShowMoreButtonClick);
  }

  _renderTopRatedMovies() {
    const topRatedMovies = this._moviesModel.getAllMovies()
      .filter((movie) => movie.filmInfo.totalRating)
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, EXTRA_MOVIES_COUNT);

    if (topRatedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(`Top rated`);
      render(this._container.getElement(), extraMovieListComponent);
      this._renderMovies(topRatedMovies, extraMovieListComponent.getElement().querySelector(`.films-list__container`));
    }
  }

  _renderMostCommentedMovies() {
    const mostCommentedMovies = this._moviesModel.getAllMovies()
      .filter((movie) => movie.comments.length)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_MOVIES_COUNT);

    if (mostCommentedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(`Most commented`);
      render(this._container.getElement(), extraMovieListComponent);
      this._renderMovies(mostCommentedMovies, extraMovieListComponent.getElement().querySelector(`.films-list__container`));
    }
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);

    if (isSuccess) {
      /* Находит все карточки, которые необходимо обновить */
      this._showedMovieControllers.concat(this._extraMovieControllers)
        .filter(({id}) => id === oldData.id)
        .forEach((movieController) => movieController.render(newData));
    }
  }

  _onViewChange() {
    this._showedMovieControllers.concat(this._extraMovieControllers)
      .forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), this._sortType);

    this._removeMovies();
    this._renderMovies(this._sortedMovies.slice(0, this._showingMoviesCount));

    this._renderShowMoreButton();
  }

  _onShowMoreButtonClick() {
    const prevMoviesCount = this._showingMoviesCount;
    this._showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

    this._renderMovies(this._sortedMovies.slice(prevMoviesCount, this._showingMoviesCount));

    if (this._showingMoviesCount >= this._sortedMovies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateMovies();
  }
}
