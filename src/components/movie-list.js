import {createElement} from './../utils.js';

const createMovieListTemplate = (moviesCount) => {
  const headlineMarkup = `<h2 class="films-list__title${moviesCount ? ` visually-hidden"> All movies. Upcoming` : `">There are no movies in our database`}</h2>`;
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
