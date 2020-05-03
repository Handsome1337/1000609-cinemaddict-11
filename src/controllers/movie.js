import MovieCardComponent from './../components/movie-card.js';
import MovieDetailsComponent from './../components/movie-details.js';
import MovieModel from './../models/movie.js';
import {render, remove, replace} from './../utils/render.js';


const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this.id = null;
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._movieCardComponent = null;
    this._movieDetailsComponent = null;

    this._removeDetails = this._removeDetails.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onAddNewComment = this._onAddNewComment.bind(this);
  }

  render(movie) {
    this.id = movie.id;
    /* Сохраняют состояния компонентов */
    const oldMovieCardComponent = this._movieCardComponent;
    const oldMovieDetailsComponent = this._movieDetailsComponent;

    this._movieCardComponent = new MovieCardComponent(movie);
    this._movieDetailsComponent = new MovieDetailsComponent(movie);

    this._subscribeOnCardEvents(movie);

    if (oldMovieCardComponent && oldMovieDetailsComponent) {
      replace(oldMovieCardComponent, this._movieCardComponent);
      replace(oldMovieDetailsComponent, this._movieDetailsComponent);
      this._subscribeOnPopupEvents(movie);
    } else {
      render(this._container, this._movieCardComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeDetails();
    }
  }

  destroy() {
    remove(this._movieCardComponent);
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onAddNewComment);
  }

  _removeDetails() {
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onAddNewComment);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeDetails();
    }
  }

  _subscribeOnCardEvents(movie) {
    /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
    this._movieCardComponent.setOnDetailsOpenersClick(() => {
      this._onViewChange();
      render(document.body, this._movieDetailsComponent);
      this._subscribeOnPopupEvents(movie);
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keydown`, this._onAddNewComment);
      this._mode = Mode.DETAILS;
    });

    this._movieCardComponent.setOnAddToWatchlistButtonClick((evt) => {
      evt.preventDefault();
      this._onWatchlistChange(movie);
    });

    this._movieCardComponent.setOnAlreadyWatchedButtonClick((evt) => {
      evt.preventDefault();
      this._onAlreadyWatchedChange(movie);
    });

    this._movieCardComponent.setOnFavoriteButtonClick((evt) => {
      evt.preventDefault();
      this._onFavoritesChange(movie);
    });
  }

  _subscribeOnPopupEvents(movie) {
    this._movieDetailsComponent.setOnCloseButtonClick(this._removeDetails);

    this._movieDetailsComponent.setOnAddToWatchlistClick(() => {
      this._onWatchlistChange(movie);
    });

    this._movieDetailsComponent.setOnAlreadyWatchedClick(() => {
      this._onAlreadyWatchedChange(movie);
    });

    this._movieDetailsComponent.setOnAddToFavoritesClick(() => {
      this._onFavoritesChange(movie);
    });

    this._movieDetailsComponent.setOnCommentDeleteClick((commentId) => {
      this._onDataChange({movie, commentId}, null);
    });

    this._movieDetailsComponent.setOnEmojiChange();
  }

  _onWatchlistChange(movie) {
    const newMovie = MovieModel.clone(movie);
    newMovie.userDetails.watchlist = !newMovie.userDetails.watchlist;
    this._onDataChange(movie, newMovie);
  }

  _onAlreadyWatchedChange(movie) {
    const newMovie = MovieModel.clone(movie);
    newMovie.userDetails.alreadyWatched = !newMovie.userDetails.alreadyWatched;
    newMovie.userDetails.watchingDate = newMovie.userDetails.alreadyWatched ? new Date().toISOString() : null;

    this._onDataChange(movie, newMovie);
  }

  _onFavoritesChange(movie) {
    const newMovie = MovieModel.clone(movie);
    newMovie.userDetails.favorite = !movie.userDetails.favorite;

    this._onDataChange(movie, newMovie);
  }

  _onAddNewComment(evt) {
    const isMac = navigator.platform.indexOf(`Mac`) >= 0;
    const isCombination = evt.key === `Enter` && (isMac ? evt.metaKey || evt.ctrlKey : evt.ctrlKey);

    if (isCombination) {
      const {comment, movie} = this._movieDetailsComponent.getData();

      /* Если не заполнен текст комментария либо не выбрана эмоция, метод завершает работу */
      if (Object.values(comment).some((prop) => !prop)) {
        return;
      }

      this._onDataChange(null, {comment, movie});
    }
  }
}
