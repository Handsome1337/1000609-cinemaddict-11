import UserRankComponent from './components/user-rank.js';
import SiteMenuController from './controllers/site-menu.js';
import MovieListComponent from './components/movie-list.js';
import PageController from './controllers/page.js';
import MovieCounterComponent from './components/movie-counter.js';
import StatisticsComponent from './components/statistics.js';
import MoviesModel from './models/movies.js';
import {generateMovies} from './mock/movie.js';
import {render} from './utils/render.js';

const MOVIE_COUNT = 22;

const movies = generateMovies(MOVIE_COUNT);
const moviesCount = movies.length;
const watchedMovies = movies.filter(({userDetails: {alreadyWatched}}) => alreadyWatched);
const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

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

const footerStatisticsElement = document.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new MovieCounterComponent(moviesCount));

siteMenuController.setOnStatsClick(() => {
  pageController.hide();
  statisticsComponent.show(moviesModel.getAllMovies().filter(({userDetails: {alreadyWatched}}) => alreadyWatched));
});
