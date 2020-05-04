import AbstractComponent from './abstract-component.js';

const createHeadlineMarkup = (moviesCount) => {
  let headlineMarkup = ``;

  if (typeof moviesCount === `number`) {
    headlineMarkup = moviesCount ? `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>` : ``;
  } else {
    headlineMarkup = `<h2 class="films-list__title">Loading...</h2>`;
  }

  return headlineMarkup;
};

const createContainerMarkup = (moviesCount) => moviesCount ? `<div class="films-list__container">\n</div>` : ``;

const createMovieListTemplate = (moviesCount) => {
  const headlineMarkup = createHeadlineMarkup(moviesCount);
  const movieListContainerMarkup = createContainerMarkup(moviesCount);

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

  onMoviesLoad(moviesCount) {
    const headlineMarkup = createHeadlineMarkup(moviesCount);
    const movieListContainerMarkup = createContainerMarkup(moviesCount);

    this.getElement().firstElementChild.innerHTML = `${headlineMarkup}\n\n${movieListContainerMarkup}`;
  }
}
