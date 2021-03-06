import AbstractComponent from './abstract-component.js';
import {formatRuntime, formatDate, formatCommentDate} from './../utils/common.js';
import {encode} from 'he';

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

const createWritersMarkup = (writers) => {
  if (!writers.length) {
    return ``;
  }

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">Writers</td>
      <td class="film-details__cell">${writers.join(`, `)}</td>
    </tr>`
  );
};

const createGenresMarkup = (genres) => {
  if (!genres.length) {
    return ``;
  }

  const genreNames = genres.reduce((acc, genre, i) => {
    const newline = i === 0 ? `` : `\n`;
    return `${acc}${newline}<span class="film-details__genre">${genre}</span>`;
  }, ``);

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${genres.length === 1 ? `Genre` : `Genres`}</td>
      <td class="film-details__cell">${genreNames}</td>
    </tr>`
  );
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
    .reduce((acc, {id, author, comment, date, emotion}, i) => {
      const newline = i === 0 ? `` : `\n`;
      const template = (
        `<li data-id="${id}" class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${formatCommentDate(date)}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
      return `${acc}${newline}${template}`;
    }, ``);
};

const createSelectedEmojiMarkup = (emoji) => `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`;

const createReactionsMarkup = (emojis) => {
  return emojis
    .reduce((acc, emoji, i) => {
      const newline = i === 0 ? `` : `\n`;
      const template = (
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}"}>
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

  const formattedActors = actors.join(`, `);
  const formattedDate = formatDate(date, true);
  const duration = formatRuntime(runtime);

  const writersMarkup = createWritersMarkup(writers);
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
              <img class="film-details__poster-img" src="./${poster}" alt="">

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
                ${writersMarkup}
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
                ${genresMarkup}
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

const parseFormData = (formData) => {
  return {
    comment: encode(formData.get(`comment`)),
    date: new Date().toISOString(),
    emotion: formData.get(`comment-emoji`)
  };
};

export default class MovieDetails extends AbstractComponent {
  constructor(movie) {
    super();

    this._movie = movie;
    this.getData = this.getData.bind(this);
  }

  getTemplate() {
    return createMovieDetailsTemplate(this._movie);
  }

  setOnCloseButtonClick(handler) {
    /* Находит кнопку закрытия попапа */
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._selectedEmoji = null;
    this._setCloseButtonClickHandler = handler;
  }

  setOnAddToWatchlistClick(handler) {
    this.getElement().querySelector(`#watchlist`)
      .addEventListener(`click`, handler);

    this._setAddToWatchlistClickHandler = handler;
  }

  setOnAlreadyWatchedClick(handler) {
    this.getElement().querySelector(`#watched`)
      .addEventListener(`click`, handler);

    this._alreadyWatchedClickHandler = handler;
  }

  setOnAddToFavoritesClick(handler) {
    this.getElement().querySelector(`#favorite`)
      .addEventListener(`click`, handler);

    this._addToFavoritesClickHandler = handler;
  }

  setOnCommentDeleteClick(handler) {
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((button) => button.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        button.disabled = true;
        button.textContent = `Deleting...`;
        const commentId = button.closest(`.film-details__comment`).dataset.id;

        handler(commentId, button);
      }));

    this._commentDeleteClickHandler = handler;
  }

  setOnEmojiChange() {
    this.getElement().querySelector(`.film-details__inner`)
      .addEventListener(`change`, (evt) => {
        if (evt.target.name !== `comment-emoji`) {
          return;
        }

        this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = createSelectedEmojiMarkup(evt.target.value);
      });
  }

  getData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    return {
      /* Элементы, которые нужно заблокировать при отправке нового комментария */
      formElements: form.querySelectorAll(`input, textarea, button`),
      comment: parseFormData(formData),
      movie: this._movie
    };
  }
}
