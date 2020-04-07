const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
/* Возвращает перетасованный массив */
const getShuffledArr = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
/* Возвращает перетасованный и случайно обрезанный массив */
const getShuffledAndSlicedArr = (arr, sliceStart, sliceEnd) => getShuffledArr(arr).slice(0, getRandomInt(sliceStart, sliceEnd));
const getRandomDate = () => {
  const date = new Date();

  /* Чтобы в моках все фильмы не были от одной даты, создадим смещение даты выпуска фильма */
  const year = getRandomInt(1977, 2019);
  const month = getRandomInt(0, 11);
  const day = getRandomInt(0, 28);

  date.setFullYear(year, month, day);

  return date;
};

const commentators = [
  `Злой тролль из интернета`,
  `Обычный пользователь`,
  `БэдКомедиан`,
  `Киноблоггер с Ютуба`,
  `Недовольный зритель`,
  `Клиент кинотеатра`,
  `Диванный эксперт`,
  `Недокритик`
];

const comments = [
  `Очень плохой фильм`,
  `Плохой фильм`,
  `Норм фильм`,
  `Неплохой фильм`,
  `Хороший фильм`,
  `Олтичный фильм`,
  `Шикарный фильм`,
  `Идеальный фильм`,
  `MUST SEE`,
  `Отвратительный фильм`
];

const emotions = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const titles = new Set([
  {"El Camino: A Breaking Bad Movie": `El Camino: Во все тяжкие`},
  {"American Pie": `Американский пирог`},
  {"Django Unchained": `Джанго освобождённый`},
  {"Scarface": `Лицо со шрамом`},
  {"Magnolia": `Магнолия`},
  {"Ocean's Eleven": `Одиннадцать друзей Оушена`},
  {"Pearl Harbor": `Пёрл-Харбор`},
  {"Project X": `Проект X: Дорвались`},
  {"Сёстры": `Сёстры`},
  {"Saving Private Ryan": `Спасти рядового Райана`},
  {"Schindler's List": `Список Шиндлера`},
  {"Kill Bill: Vol. 1": `Убить Билла`},
  {"Jackass: The Movie": `Чудаки`},
  {"Jackass: Volume Two": `Чудаки: Часть вторая`},
  {"(500) Days of Summer": `500 дней лета`}
]);

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const ageRatings = [0, 6, 12, 16, 18];

const directors = [
  `Винс Гиллиган`,
  `Пол Вайц`,
  `Крис Вайц`,
  `Квентин Тарантино`,
  `Брайан Де Пальма`,
  `Пол Томас Андерсон`,
  `Стивен Содерберг`,
  `Майкл Бэй`,
  `Нима Нуризаде`,
  `Сергей Бодров мл.`,
  `Стивен Спилберг`,
  `Джефф Треймейн`,
  `Марк Уэбб`
];

const writers = [
  `Винс Гиллиган`,
  `Адам Херц`,
  `Квентин Тарантино`,
  `Оливер Стоун`,
  `Армитэдж Трэйл`,
  `Бен Хект`,
  `Пол Томас Андерсон`,
  `Гарри Браун`,
  `Чарльз Ледерер`,
  `Тед Гриффин`,
  `Рэндалл Уоллес`,
  `Майкл Бэколл`,
  `Мэтт Дрэйк`,
  `Сергей Бодров мл.`,
  `Сергей Бодров`,
  `Гульшад Омарова`,
  `Роберт Родат`,
  `Стивен Зеллиан`,
  `Томас Кенилли`,
  `Ума Турман`,
  `Джефф Треймейнл`,
  `Спайк Джонс`,
  `Джонни Ноксвил`,
  `Скотт Нойстедтер`,
  `Майкл Х. Уэбер`
];

const actors = [
  `Уилл Смит`,
  `Сэмюэл Л. Джексон`,
  `Брэд Питт`,
  `Леонардо ДиКаприо`,
  `Сильвестр Сталлоне`,
  `Вуди Харрельсон`,
  `Эштон Кутчер`,
  `Джонни Депп`,
  `Харрисон Форд`,
  `Орландо Блум`,
  `Джейсон Стэйтем`,
  `Роберт Де Ниро`,
  `Мэтт Дэймон`,
  `Аль Пачино`,
  `Джаред Лето`,
  `Кира Найтли`
];

const countries = [
  `США`,
  `Индия`,
  `Франция`,
  `Япония`,
  `Китай`,
  `Италия`,
  `Германия`,
  `Россия`
];

const genres = [
  `Боевик`,
  `Детектив`,
  `Документальный`,
  `Драма`,
  `Комедия`,
  `Криминал`,
  `Мелодрама`,
  `Мультфильм`,
  `Мюзикл`,
  `Приключения`,
  `Триллер`,
  `Ужасы`,
  `Фантастика`,
  `Фэнтези`
];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

/* Возвращает массив случайных комментариев */
const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => {
      return {
        id: String(new Date() + Math.random()),
        author: getRandomArrayItem(commentators),
        comment: getRandomArrayItem(comments),
        date: getRandomDate(),
        emotion: getRandomArrayItem(emotions)
      };
    });
};
/* Возвращает случайный массив от 1 до 3 сценаристов */
const generateWriters = (screenWriters) => getShuffledAndSlicedArr(screenWriters, 1, 3);
/* Возвращает случайный массив от 2 до 4 актёров */
const generateActors = (movieActors) => getShuffledAndSlicedArr(movieActors, 2, 4);
/* Возвращает случайный массив от 1 до 4 жанров */
const generateGenres = (movieGenres) => getShuffledAndSlicedArr(movieGenres, 1, 4);
/* Возвращает случайное описание фильма от 1 до 5 предложений */
const generateDescription = (text) => {
  /* Удаляет точку у последнего предложения, чтобы все предложения попали в массив без точек. Затем создаёт массив из предложений */
  const sentences = text.slice(0, -1).split(`. `);
  const desc = getShuffledAndSlicedArr(sentences, 1, 5);

  /* Преобразовывает массив предложений массив в строку и добавляет точку последнему предложению */
  return `${desc.join(`. `)}.`;
};

const generateMovie = () => {
  /* Получаем объект, где ключ - оригинальное название фильма, значение - альтернативное название */
  const title = getRandomArrayItem([...titles]);
  const isWatched = Math.random() > 0.7;

  return {
    id: String(new Date() + Math.random()),
    comments: generateComments(getRandomInt(0, 5)), // думаю, магические числа в моках не проблема - этих файлов уже не будет на защите
    filmInfo: {
      title: Object.keys(title)[0],
      alternativeTitle: Object.values(title)[0],
      totalRating: getRandomInt(0, 9),
      poster: getRandomArrayItem(posters),
      ageRating: getRandomArrayItem(ageRatings),
      director: getRandomArrayItem(directors),
      writers: new Set(generateWriters(writers)),
      actors: new Set(generateActors(actors)),
      release: {
        date: getRandomDate(),
        releaseCountry: getRandomArrayItem(countries)
      },
      runtime: getRandomInt(45, 275),
      genre: new Set(generateGenres(genres)),
      description: generateDescription(description)
    },
    userDetails: {
      watchlist: isWatched ? false : Math.random() > 0.5,
      alreadyWatched: isWatched,
      watchingDate: isWatched ? getRandomDate() : null,
      favorite: isWatched ? Math.random() > 0.5 : false
    }
  };
};

const generateMovies = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateMovie);
};

export {generateMovies};
