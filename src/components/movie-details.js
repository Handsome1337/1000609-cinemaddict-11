import AbstractComponent from './abstract-component.js';
import {formatRuntime, formatDate} from './../utils/common.js';

const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];

/* Содержит модификатор класса (который совпадает с атрибутами id и name) и текст для каждого инпута (ключи - свойства фильма, которые пользователь может изменять) */
const inputPropsMap = new Map([
  [`watchlist`, {
    name: `watchlist`,
    text: `Add to watchlist`
  }],
  [`alreadyWatched`, {
    name: `watched`,
    text: `Already watched`
  }],
  [`favorite`, {
    name: `favorite`,
    text: `Add to favorites`
  }]
]);

const createGenresMarkup = (genres) => {
  return [...genres]
    .reduce((acc, genre, i) => {
      const newline = i === 0 ? `` : `\n`;
      return `${acc}${newline}<span class="film-details__genre">${genre}</span>`;
    }, ``);
};

const createControlsMarkup = (userDetails) => {
  return [...inputPropsMap.entries()] // преобразует итератор в массив
    .reduce((acc, [prop, values], i) => { // с помощью деструктуризации вытаскивает название свойства и объект со значениями модификатора и текста
      const newline = i === 0 ? `` : `\n`;
      const template = (
        `<input type="checkbox" class="film-details__control-input visually-hidden" id="${values.name}" name="${values.name}" ${userDetails[prop] ? `checked` : ``}>
        <label for="${values.name}" class="film-details__control-label film-details__control-label--${values.name}">${values.text}</label>`
      );
      return `${acc}${newline}${template}`;
    }, ``);
};

const createCommentsMarkup = (comments) => {
  return comments
    .reduce((acc, {author, comment, date, emotion}, i) => {
      const newline = i === 0 ? `` : `\n`;
      const template = (
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${formatDate(date, `comment`)}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
      return `${acc}${newline}${template}`;
    }, ``);
};

const createReactionsMarkup = (emojis) => {
  return emojis
    .reduce((acc, emoji, i) => {
      const newline = i === 0 ? `` : `\n`;
      const template = (
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`
      );
      return `${acc}${newline}${template}`;
    }, ``);
};


const createMovieDetailsTemplate = (movie) => {
  const {title, alternativeTitle, totalRating: rating, poster, ageRating, director, writers,
    actors, release: {date, releaseCountry}, runtime, genre, description} = movie.filmInfo;
  const comments = movie.comments;
  const userDetails = movie.userDetails;

  const formattedWriters = [...writers].join(`, `);
  const formattedActors = [...actors].join(`, `);
  const formattedDate = formatDate(date, true);
  const duration = formatRuntime(runtime);

  const genresMarkup = createGenresMarkup(genre);
  const controlsMarkup = createControlsMarkup(userDetails);
  const commentsMarkup = createCommentsMarkup(comments);
  const reactionsMarkup = createReactionsMarkup(EMOTIONS);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${alternativeTitle}</h3>
                  <p class="film-details__title-original">Original: ${title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${formattedWriters}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${formattedActors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formattedDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.size === 1 ? `Genre` : `Genres`}</td>
                  <td class="film-details__cell">${genresMarkup}</td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${controlsMarkup}
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${reactionsMarkup}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MovieDetails extends AbstractComponent {
  constructor(movie) {
    super();

    this._movie = movie;
  }

  getTemplate() {
    return createMovieDetailsTemplate(this._movie);
  }

  setOnCloseButtonClick(handler) {
    /* Находит кнопку закрытия попапа */
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
  }
}
