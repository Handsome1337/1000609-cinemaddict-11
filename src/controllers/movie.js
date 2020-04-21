import MovieCardComponent from './../components/movie-card.js';
import MovieDetailsComponent from './../components/movie-details.js';
import {render, remove} from './../utils/render.js';

export default class MovieController {
  constructor(movie) {
    this._movie = movie;
    this.id = this._movie.id;

    this._movieCardComponent = new MovieCardComponent(this._movie);
    this._movieDetailsComponent = new MovieDetailsComponent(this._movie);

    this._removeDetails = this._removeDetails.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(container) {
    /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
    this._movieCardComponent.setOnDetailsOpenersClick(() => {
      render(document.body, this._movieDetailsComponent);
      /* Добавляет обработчик клика, вызывающий удаление попапа с подробной информацией о фильме */
      this._movieDetailsComponent.setOnCloseButtonClick(this._removeDetails);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    render(container, this._movieCardComponent);
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
