import MovieCardComponent from './../components/movie-card.js';
import MovieDetailsComponent from './../components/movie-details.js';
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
  }

  _removeDetails() {
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
      this._mode = Mode.DETAILS;
    });

    this._movieCardComponent.setOnAddToWatchlistButtonClick(() => {
      this._onWatchlistChange(movie);
    });

    this._movieCardComponent.setOnAlreadyWatchedButtonClick(() => {
      this._onAlreadyWatchedChange(movie);
    });

    this._movieCardComponent.setOnFavoriteButtonClick(() => {
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

    this._movieDetailsComponent.setOnEmojiChange();
  }

  _onWatchlistChange(movie) {
    this._onDataChange(movie, Object.assign({}, movie, {
      userDetails: {
        watchlist: !movie.userDetails.watchlist,
        alreadyWatched: movie.userDetails.alreadyWatched,
        watchingDate: movie.userDetails.watchingDate,
        favorite: movie.userDetails.favorite
      }
    }));
  }

  _onAlreadyWatchedChange(movie) {
    const alreadyWatched = !movie.userDetails.alreadyWatched;
    const watchingDate = alreadyWatched ? Date.now() : null;

    this._onDataChange(movie, Object.assign({}, movie, {
      userDetails: {
        watchlist: movie.userDetails.watchlist,
        alreadyWatched,
        watchingDate,
        favorite: movie.userDetails.favorite
      }
    }));
  }

  _onFavoritesChange(movie) {
    this._onDataChange(movie, Object.assign({}, movie, {
      userDetails: {
        watchlist: movie.userDetails.watchlist,
        alreadyWatched: movie.userDetails.alreadyWatched,
        watchingDate: movie.userDetails.watchingDate,
        favorite: !movie.userDetails.favorite
      }
    }));
  }
}
