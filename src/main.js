import UserRankComponent from './components/user-rank.js';
import SiteMenuController from './controllers/site-menu.js';
import MovieListComponent from './components/movie-list.js';
import PageController from './controllers/page.js';
import MovieCounterComponent from './components/movie-counter.js';
import StatisticsComponent from './components/statistics.js';
import MoviesModel from './models/movies.js';
import API from './api.js';
import {render} from './utils/render.js';

const AUTHORIZATION = `Basic 1337`;

const api = new API(AUTHORIZATION);
const moviesModel = new MoviesModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    const moviesCount = moviesModel.getAllMovies().length;
    const watchedMovies = moviesModel.getAllMovies().filter(({userDetails: {alreadyWatched}}) => alreadyWatched);
    render(siteHeaderElement, new UserRankComponent(watchedMovies.length));

    const siteMenuController = new SiteMenuController(siteMainElement, moviesModel, () => {
      statisticsComponent.hide();
      pageController.show();
    });
    siteMenuController.render();

    const movieListComponent = new MovieListComponent(moviesCount);
    const pageController = new PageController(movieListComponent, moviesModel);
    render(siteMainElement, movieListComponent);
    pageController.render();

    const statisticsComponent = new StatisticsComponent(watchedMovies);
    render(siteMainElement, statisticsComponent);
    statisticsComponent.hide();

    render(footerStatisticsElement, new MovieCounterComponent(moviesCount));

    siteMenuController.setOnStatsClick(() => {
      pageController.hide();
      statisticsComponent.show(moviesModel.getAllMovies().filter(({userDetails: {alreadyWatched}}) => alreadyWatched));
    });
  });
