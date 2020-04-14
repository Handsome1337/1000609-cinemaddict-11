import {formatRuntime, formatDate, createElement} from './../utils.js';

const DESCRIPTION_MAX_LENGTH = 140;
const DESCRIPTION_END_CHECK = /[\s.,]$/;

/* Содержит модификатор класса и текст для каждой кнопки (ключи - свойства фильма, которые пользователь может изменять) */
const buttonPropsMap = new Map([
  [`watchlist`, {
    modifier: `add-to-watchlist`,
    text: `Add to watchlist`
  }],
  [`alreadyWatched`, {
    modifier: `mark-as-watched`,
    text: `Mark as watched`
  }],
  [`favorite`, {
    modifier: `favorite`,
    text: `Mark as favorite`
  }]
]);

/* Удаляет символ пробела, точки или запятой, если краткое описание закончилось на один из этих символов */
const formatDescription = (desc) => {
  let formattedDesc = desc;
  if (DESCRIPTION_END_CHECK.test(formattedDesc)) {
    formattedDesc = formatDescription(formattedDesc.replace(DESCRIPTION_END_CHECK, ``));
  }

  return formattedDesc;
};

const createButtonsMarkup = (userDetails) => {
  return [...buttonPropsMap.entries()] // преобразует итератор в массив
    .reduce((acc, [prop, values], i) => { // с помощью деструктуризации вытаскивает название свойства и объект со значениями модификатора и текста
      const newline = i === 0 ? `` : `\n`;
      const template = (
        `<button class="film-card__controls-item button film-card__controls-item--${values.modifier} ${userDetails[prop] ? `film-card__controls-item--active` : ``}">
          ${values.text}
        </button>`
      );
      return `${acc}${newline}${template}`;
    }, ``);
};

const createMovieCardTemplate = (movie) => {
  const {alternativeTitle: title, totalRating: rating, release: {date}, runtime, genre, poster, description} = movie.filmInfo;
  const commentsCount = movie.comments.length;
  const userDetails = movie.userDetails;

  /* Проверяет, превышает ли описание фильма максимальный размер краткого описания */
  const isDescriptionExcess = description.length > DESCRIPTION_MAX_LENGTH;

  const releaseYear = formatDate(date);
  const duration = formatRuntime(runtime);
  const genreList = [...genre].join(`, `);

  /* Если длина описания фильма превышает норму, форматирует его */
  const formattedDescription = isDescriptionExcess ? `${formatDescription(description.slice(0, DESCRIPTION_MAX_LENGTH - 1))}…` : description;

  const buttonsMarkup = createButtonsMarkup(userDetails);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genreList}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${formattedDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${buttonsMarkup}
      </form>
    </article>`
  );
};

export default class MovieCard {
  constructor(movie) {
    this._movie = movie;

    this._element = null;
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
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
