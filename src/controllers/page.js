import SortingComponent, {SortType} from './../components/sorting.js';
import NoMoviesComponent from './../components/no-movies.js';
import MovieController from './../controllers/movie.js';
import ShowMoreButtonComponent from './../components/show-more-button.js';
import ExtraMovieListComponent from './../components/extra-movie-list.js';
import {RenderPosition, render, remove} from './../utils/render.js';

const ShowingMoviesCount = {
  ON_START: 5,
  BY_BUTTON: 5,
  EXTRA: 2
};

const ExtraBlock = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`
};
const COMMENT_ELEMENT = `TEXTAREA`;

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
      sortedMovies = [...movies].sort((a, b) => -a.filmInfo.release.date.localeCompare(b.filmInfo.release.date));
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
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._showedMovieControllers = [];
    /* Сохраняет контроллеры фильмов из дополнительных блоков отдельно, чтобы при сортировки и сбросе _showedMovieControllers они не удалялись */
    this._extraMovieControllers = [];
    this._showingMoviesCount = ShowingMoviesCount.ON_START;
    this._sortingComponent = new SortingComponent();
    this._sortType = SortType.DEFAULT;
    this._sortedMovies = null;
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

  hide() {
    this._container.hide();
    this._sortingComponent.hide();
  }

  show() {
    this._container.show();
    this._sortingComponent.show();
  }

  render() {
    const container = this._container.getElement();

    render(container, this._sortingComponent, RenderPosition.BEFORE);

    const isLoading = !!document.querySelector(`.films-list__title:not(.visually-hidden)`);

    if (isLoading) {
      return;
    }

    const movies = this._moviesModel.getMovies();
    this._sortedMovies = movies;

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
    this._renderMovies(this._sortedMovies.slice(0, ShowingMoviesCount.ON_START));
    this._renderShowMoreButton();
  }

  _updateMovie(movie) {
    this._sortedMovies = this._sortedMovies.map((it) => {
      if (it.id === movie.id) {
        return movie;
      }
      return it;
    });
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
      .slice(0, ShowingMoviesCount.EXTRA);

    if (topRatedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(ExtraBlock.TOP_RATED);
      render(this._container.getElement(), extraMovieListComponent);
      this._renderMovies(topRatedMovies, extraMovieListComponent.getElement().querySelector(`.films-list__container`));
    }
  }

  _renderMostCommentedMovies() {
    /* Так как блок Most commented должен обновлятся при взаимодействии пользователя с комментариями, при рендеринге необходимо удалять блок, если он был отрисован ранее */
    const mostCommentedTitleElement = [...this._container.getElement().querySelectorAll(`.films-list__title`)]
      .find((listTitle) => listTitle.textContent.includes(ExtraBlock.MOST_COMMENTED));

    if (mostCommentedTitleElement) {
      mostCommentedTitleElement.parentElement.remove();
    }

    const mostCommentedMovies = this._moviesModel.getAllMovies()
      .filter((movie) => movie.comments.length)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, ShowingMoviesCount.EXTRA);

    if (mostCommentedMovies.length) {
      const extraMovieListComponent = new ExtraMovieListComponent(ExtraBlock.MOST_COMMENTED);
      render(this._container.getElement(), extraMovieListComponent);
      this._renderMovies(mostCommentedMovies, extraMovieListComponent.getElement().querySelector(`.films-list__container`));
    }
  }

  _onDataChange(oldData, newData) {
    /* newData === null в случае, когда необходимо удалить комментарий */
    if (newData === null) {
      const {movie, commentId, button} = oldData;
      this._api.deleteComment(commentId, movie)
        .then(() => {
          const isSuccess = this._moviesModel.removeComment(commentId, movie);

          if (isSuccess) {
            /* Находит все карточки, которые необходимо обновить */
            this._showedMovieControllers.concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.render(this._moviesModel.getAllMovies().find((it) => it.id === movie.id)));

            this._renderMostCommentedMovies();
          }
        })
        .catch(() => {
          button.disabled = false;
          button.textContent = `Delete`;
          this._showedMovieControllers.concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.shake());
        });
    /* oldData === null в случае, когда необходимо добавить комментарий */
    } else if (oldData === null) {
      const {movie: newMovie, comment, onAddNewComment} = newData;
      this._api.addComment(newMovie, comment)
        .then((movie) => {
          const isSuccess = this._moviesModel.addComment(movie.comments.pop(), movie);

          if (isSuccess) {
            /* Находит все карточки, которые необходимо обновить */
            this._showedMovieControllers.concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.render(this._moviesModel.getAllMovies().find((it) => it.id === movie.id)));

            this._renderMostCommentedMovies();
          }
        })
        .catch(() => {
          /* Разблокирует форму и добавляет красную обводку полю ввода */
          document.querySelectorAll(`[disabled]`).forEach((element) => {
            element.disabled = false;

            if (element.tagName === COMMENT_ELEMENT) {
              element.style.boxShadow = `0 0 0 3px red`;
            }
          });

          this._showedMovieControllers.concat(this._extraMovieControllers)
              .filter(({id}) => id === newMovie.id)
              .forEach((movieController) => movieController.shake());
        });

      /* Восстанавливает обработчик отправки формы*/
      document.addEventListener(`keydown`, onAddNewComment);
    } else {
      this._api.updateMovie(oldData.id, newData)
        .then((movieModel) => {
          const isSuccess = this._moviesModel.updateMovie(oldData.id, movieModel);

          if (isSuccess) {
            this._updateMovie(movieModel);
            /* Находит все карточки, которые необходимо обновить */
            this._showedMovieControllers.concat(this._extraMovieControllers)
            .filter(({id}) => id === oldData.id)
            .forEach((movieController) => movieController.render(movieModel));
          }
        })
        .catch(() => {
          this._showedMovieControllers.concat(this._extraMovieControllers)
              .filter(({id}) => id === oldData.id)
              .forEach((movieController) => movieController.shake());
        });
    }
  }

  _onViewChange() {
    this._showedMovieControllers.concat(this._extraMovieControllers)
      .forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._showingMoviesCount = ShowingMoviesCount.ON_START;

    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), this._sortType);

    this._removeMovies();
    this._renderMovies(this._sortedMovies.slice(0, this._showingMoviesCount));

    this._renderShowMoreButton();
  }

  _onShowMoreButtonClick() {
    const prevMoviesCount = this._showingMoviesCount;
    this._showingMoviesCount += ShowingMoviesCount.BY_BUTTON;

    this._renderMovies(this._sortedMovies.slice(prevMoviesCount, this._showingMoviesCount));

    if (this._showingMoviesCount >= this._sortedMovies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateMovies();
  }
}
