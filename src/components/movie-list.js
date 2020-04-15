import {createElement} from './../utils.js';

const createMovieListTemplate = (moviesCount) => {
  const headlineMarkup = moviesCount ? `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>` : ``;
  const movieListContainerMarkup = moviesCount ? `<div class="films-list__container">\n</div>` : ``;

  return (
    `<section class="films">
      <section class="films-list">
        ${headlineMarkup}

        ${movieListContainerMarkup}
      </section>
    </section>`
  );
};

export default class MovieList {
  constructor(moviesCount) {
    this._moviesCount = moviesCount;

    this._element = null;
  }

  getTemplate() {
    return createMovieListTemplate(this._moviesCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
