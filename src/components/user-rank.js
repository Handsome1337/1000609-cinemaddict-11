import AbstractComponent from './abstract-component.js';

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

export default class UserRank extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createUserRankTemplate(this._count);
  }
}
