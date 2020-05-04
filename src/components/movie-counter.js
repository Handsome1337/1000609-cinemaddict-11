import AbstractComponent from './abstract-component.js';

const createMovieCounterTemplate = (count) => `<p>${count ? count : `0`} movies inside</p>`;

export default class MovieCounter extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createMovieCounterTemplate(this._count);
  }
}
