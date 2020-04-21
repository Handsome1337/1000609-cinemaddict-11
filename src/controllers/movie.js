import MovieCardComponent from './../components/movie-card.js';
import MovieDetailsComponent from './../components/movie-details.js';
import {render, remove, replace} from './../utils/render.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this.id = null;
    this._container = container;
    this._onDataChange = onDataChange;

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

    /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
    this._movieCardComponent.setOnDetailsOpenersClick(() => {
      render(document.body, this._movieDetailsComponent);
      /* Добавляет обработчик клика, вызывающий удаление попапа с подробной информацией о фильме */
      this._movieDetailsComponent.setOnCloseButtonClick(this._removeDetails);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._movieCardComponent.setOnAddToWatchlistButtonClick(() => {
      this._onDataChange(movie, Object.assign({}, movie, {
        userDetails: {
          watchlist: !movie.userDetails.watchlist,
          alreadyWatched: movie.userDetails.alreadyWatched,
          watchingDate: movie.userDetails.watchingDate,
          favorite: movie.userDetails.favorite
        }
      }));
    });

    this._movieCardComponent.setOnAlreadyWatchedButtonClick(() => {
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
    });

    this._movieCardComponent.setOnFavoriteButtonClick(() => {
      this._onDataChange(movie, Object.assign({}, movie, {
        userDetails: {
          watchlist: movie.userDetails.watchlist,
          alreadyWatched: movie.userDetails.alreadyWatched,
          watchingDate: movie.userDetails.watchingDate,
          favorite: !movie.userDetails.favorite
        }
      }));
    });

    if (oldMovieCardComponent && oldMovieDetailsComponent) {
      replace(oldMovieCardComponent, this._movieCardComponent);
      replace(oldMovieDetailsComponent, this._movieDetailsComponent);
    } else {
      render(this._container, this._movieCardComponent);
    }
  }

  _removeDetails() {
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeDetails();
    }
  }
}
