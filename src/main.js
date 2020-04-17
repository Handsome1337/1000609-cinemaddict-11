import UserRankComponent from './components/user-rank.js';
import SiteMenuComponent from './components/site-menu.js';
import SortingComponent from './components/sorting.js';
import MovieListComponent from './components/movie-list.js';
import PageController from './controllers/page.js';
import MovieCounterComponent from './components/movie-counter.js';
import {generateMovies} from './mock/movie.js';
import {generateFilters} from './mock/filter.js';
import {render} from './utils/render.js';

const MOVIE_COUNT = 22;

const movies = generateMovies(MOVIE_COUNT);
const moviesCount = movies.length;
const filters = generateFilters(movies);
const watchedMoviesCount = filters.find(({name}) => name === `History`).count;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new UserRankComponent(watchedMoviesCount));
render(siteMainElement, new SiteMenuComponent(filters));
render(siteMainElement, new SortingComponent());

const movieListComponent = new MovieListComponent(moviesCount);
const pageController = new PageController(movieListComponent);
render(siteMainElement, movieListComponent);
pageController.render(movies);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new MovieCounterComponent(moviesCount));
