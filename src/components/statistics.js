import AbstractSmartComponent from './abstract-smart-component.js';
import {formatRank} from './../utils/common.js';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const PERIODS = [`All time`, `Today`, `Week`, `Month`, `Year`];
const BAR_HEIGHT = 50;

const getGenres = (movies) => {
  return movies.reduce((acc, {filmInfo: {genre}}) => {
    /* Пробегает по всем жанрам, к которым относится фильм. Если жанра нет в аккумуляторе, добавляет его */
    [...genre].forEach((it) => {
      if (!acc.includes(it)) {
        acc.push(it);
      }
    });
    return acc;
  }, []);
};

/* Подсчитывает количество фильмов с переданным жанром */
const getGenreValue = (genre, movies) => movies.filter(({filmInfo: {genre: movieGenres}}) => [...movieGenres].includes(genre)).length;

const getMoviesByDateRange = (movies, period) => {
  let dateFrom;
  const dateNow = new Date();

  switch (period) {
    case `today`:
      dateFrom = new Date(dateNow.setDate(dateNow.getDate() - 1));
      break;
    case `week`:
      dateFrom = new Date(dateNow.setDate(dateNow.getDate() - 7));
      break;
    case `month`:
      dateFrom = new Date(dateNow.setMonth(dateNow.getMonth() - 1));
      break;
    case `year`:
      dateFrom = new Date(dateNow.setFullYear(dateNow.getFullYear() - 1));
      break;
    default:
      dateFrom = null;
  }

  return movies.filter((movie) => {
    const watchingDate = movie.userDetails.watchingDate;

    return dateFrom ? watchingDate >= dateFrom && watchingDate <= new Date() : movie;
  });
};

const formatTotalRuntime = (movies) => {
  const totalRuntime = movies.reduce((acc, movie) => acc + movie.filmInfo.runtime, 0);

  return {
    hoursDuration: ~~moment.duration(totalRuntime, `minutes`).asHours(),
    minutesDuration: moment.duration(totalRuntime, `minutes`).minutes()
  };
};

const createRankMarkup = (rank) => {
  return (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>`
  );
};

const createPeriodsMarkup = (filter) => {
  return PERIODS.reduce((acc, period) => {
    const value = period.toLowerCase().replace(/\s/, `-`);
    const template = (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${value}" value="${value}" ${value === filter ? `checked` : ``}>
      <label for="statistic-${value}" class="statistic__filters-label">${period}</label>`
    );

    return `${acc}\n${template}`;
  }, ``);
};

const renderChart = (genresCtx, movies) => {
  const genres = getGenres(movies);

  genresCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genres.map((genre) => getGenreValue(genre, movies)),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (movies, filter) => {
  const rank = formatRank(movies.length);
  const moviesByDateRange = getMoviesByDateRange(movies, filter);
  const count = moviesByDateRange.length;
  const {hoursDuration, minutesDuration} = formatTotalRuntime(moviesByDateRange);

  const rankMarkup = rank ? createRankMarkup(rank) : ``;
  const periodsMarkup = createPeriodsMarkup(filter);
  const favoriteGenre = getGenres(moviesByDateRange)
    .reduce((acc, genre) => getGenreValue(genre, moviesByDateRange) > getGenreValue(acc, moviesByDateRange) ? genre : acc, ``);

  return (
    `<section class="statistic">
      ${rankMarkup}

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${periodsMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${count} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hoursDuration} <span class="statistic__item-description">h</span> ${minutesDuration} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${favoriteGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statictics extends AbstractSmartComponent {
  constructor(movies) {
    super();

    this._movies = movies;
    this._filter = `all-time`;

    this._chart = null;

    this._renderChart();
    this._onFilterChange();
  }

  getTemplate() {
    return createStatisticsTemplate(this._movies, this._filter);
  }

  recoveryListeners() {
    this._onFilterChange();
  }

  rerender() {
    super.rerender();

    this._renderChart();
  }

  _renderChart() {
    const statisticsCtx = this.getElement().querySelector(`.statistic__chart`);
    const movies = getMoviesByDateRange(this._movies, this._filter);

    this._chart = renderChart(statisticsCtx, movies);
  }

  _onFilterChange() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        this._filter = evt.target.value;
        this.rerender();
      });
  }
}
