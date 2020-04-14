import {createElement} from './../utils.js';

const createMovieCounterTemplate = (count) => `<p>${count} movies inside</p>`;

export default class MovieCounter {
  constructor(count) {
    this._count = count;

    this._element = null;
  }

  getTemplate() {
    return createMovieCounterTemplate(this._count);
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
