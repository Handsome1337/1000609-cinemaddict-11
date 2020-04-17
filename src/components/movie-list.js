import AbstractComponent from './abstract-component.js';

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

export default class MovieList extends AbstractComponent {
  constructor(moviesCount) {
    super();

    this._moviesCount = moviesCount;
  }

  getTemplate() {
    return createMovieListTemplate(this._moviesCount);
  }
}
