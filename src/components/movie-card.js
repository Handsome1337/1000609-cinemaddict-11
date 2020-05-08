import AbstractComponent from './abstract-component.js';
import {formatRuntime, formatDate} from './../utils/common.js';

const Description = {
  MAX_LENGTH: 140,
  END_CHECK: /[\s.,]$/
};

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
  if (Description.END_CHECK.test(formattedDesc)) {
    formattedDesc = formatDescription(formattedDesc.replace(Description.END_CHECK, ``));
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
  const isDescriptionExcess = description.length > Description.MAX_LENGTH;

  const releaseYear = formatDate(date);
  const duration = formatRuntime(runtime);
  const genreList = genre.join(`, `);

  /* Если длина описания фильма превышает норму, форматирует его */
  const formattedDescription = isDescriptionExcess ? `${formatDescription(description.slice(0, Description.MAX_LENGTH - 1))}…` : description;

  const buttonsMarkup = createButtonsMarkup(userDetails);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        ${genreList.length ? `<span class="film-card__genre">${genreList}</span>` : ``}
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${formattedDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${buttonsMarkup}
      </form>
    </article>`
  );
};

export default class MovieCard extends AbstractComponent {
  constructor(movie) {
    super();

    this._movie = movie;
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  setOnDetailsOpenersClick(handler) {
    const moviePosterElement = this.getElement().querySelector(`.film-card__poster`);
    const movieTitleElement = this.getElement().querySelector(`.film-card__title`);
    const movieCommentsCountElement = this.getElement().querySelector(`.film-card__comments`);
    /* Сохраняет все элементы, клик на которые вызывает показ попапа с подробной информацией о фильме, в массив */
    const detailsOpeners = [moviePosterElement, movieTitleElement, movieCommentsCountElement];

    /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
    detailsOpeners.forEach((detailsOpener) => detailsOpener.addEventListener(`click`, handler));
  }

  setOnAddToWatchlistButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setOnAlreadyWatchedButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setOnFavoriteButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
