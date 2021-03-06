import UserRankComponent from './components/user-rank.js';
import SiteMenuController from './controllers/site-menu.js';
import MovieListComponent from './components/movie-list.js';
import PageController from './controllers/page.js';
import MovieCounterComponent from './components/movie-counter.js';
import StatisticsComponent from './components/statistics.js';
import MoviesModel from './models/movies.js';
import API from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {render, replace} from './utils/render.js';

const AUTHORIZATION = `Basic IlyaV`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-handsome1337-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const siteMenuController = new SiteMenuController(siteMainElement, moviesModel, () => {
  statisticsComponent.hide();
  pageController.show();
});
siteMenuController.render();

const movieListComponent = new MovieListComponent();
const pageController = new PageController(movieListComponent, moviesModel, apiWithProvider);
render(siteMainElement, movieListComponent);
pageController.render();

const statisticsComponent = new StatisticsComponent(moviesModel.getAllMovies().filter(({userDetails: {alreadyWatched}}) => alreadyWatched));
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

siteMenuController.setOnStatsClick(() => {
  pageController.hide();
  statisticsComponent.show(moviesModel.getAllMovies().filter(({userDetails: {alreadyWatched}}) => alreadyWatched));
});

const movieCounterComponent = new MovieCounterComponent();
render(footerStatisticsElement, movieCounterComponent);

apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    const moviesCount = moviesModel.getAllMovies().length;
    const watchedMovies = moviesModel.getAllMovies().filter(({userDetails: {alreadyWatched}}) => alreadyWatched);
    render(siteHeaderElement, new UserRankComponent(watchedMovies.length));

    siteMenuController.render();

    movieListComponent.onMoviesLoad(moviesCount);
    pageController.render();

    replace(movieCounterComponent, new MovieCounterComponent(moviesCount));
  })
  .catch(() => {
    const moviesCount = moviesModel.getAllMovies().length;
    movieListComponent.onMoviesLoad(moviesCount);
    pageController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
