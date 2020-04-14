import {createElement} from './../utils.js';

const createRankMarkup = (watchedMoviesCount) => {
  const template = (text) => `<p class="profile__rating">${text}</p>`;

  if (watchedMoviesCount <= 10) {
    return template(`Novice`);
  } else if (watchedMoviesCount > 10 && watchedMoviesCount <= 20) {
    return template(`Fan`);
  } else {
    return template(`Movie Buff`);
  }
};

const createUserRankTemplate = (count) => {
  if (count < 1) {
    return ``;
  }

  const rankMarkup = createRankMarkup(count);

  return (
    `<section class="header__profile profile">
      ${rankMarkup}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRank {
  constructor(count) {
    this._count = count;

    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate(this._count);
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
