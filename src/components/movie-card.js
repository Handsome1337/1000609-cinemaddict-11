import {formatRuntime, formatDate} from './../utils.js';

const DESCRIPTION_MAX_LENGTH = 140;

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

const createButtonsMarkup = (userDetails) => {
  return [...buttonPropsMap.entries()] // преобразует итератор в массив
    .map(([prop, values]) => { // с помощью деструктуризации вытаскивает название свойства и объект со значениями модификатора и текста
      return (
        `<button class="film-card__controls-item button film-card__controls-item--${values.modifier} ${userDetails[prop] ? `film-card__controls-item--active` : ``}">
          ${values.text}
        </button>`
      );
    })
    .join(`\n`);
};

export const createMovieCardTemplate = (movie) => {
  const {alternativeTitle: title, totalRating: rating, release: {date}, runtime, genre, poster, description} = movie.filmInfo;
  const commentsCount = movie.comments.length;
  const userDetails = movie.userDetails;

  /* Проверяет, превышает ли описание фильма максимальный размер краткого описания */
  const isDescriptionExcess = description.length > DESCRIPTION_MAX_LENGTH;

  const releaseYear = formatDate(date);
  const duration = formatRuntime(runtime);
  const mainGenre = Array.from(genre)[0];

  /* Если длина описания фильма превышает норму, форматирует его (вдобавок удаляет символ пробела, точки или запятой, если отформатированное описание закончилось на один из этих символов) */
  const formattedDescription = isDescriptionExcess ? `${description.slice(0, DESCRIPTION_MAX_LENGTH - 1).replace(/[\s,.]$/, ``)}…` : description;

  const buttonsMarkup = createButtonsMarkup(userDetails);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${mainGenre}</span>
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