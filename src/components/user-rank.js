import AbstractComponent from './abstract-component.js';
import {formatRank} from './../utils/common.js';

const createRankMarkup = (watchedMoviesCount) => {
  return `<p class="profile__rating">${formatRank(watchedMoviesCount)}</p>`;
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

export default class UserRank extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createUserRankTemplate(this._count);
  }
}
