import UserRankComponent from './components/user-rank.js';
import FilterController from './controllers/filter.js';
import MovieListComponent from './components/movie-list.js';
import PageController from './controllers/page.js';
import MovieCounterComponent from './components/movie-counter.js';
import MoviesModel from './models/movies.js';
import {generateMovies} from './mock/movie.js';
import {render} from './utils/render.js';

const MOVIE_COUNT = 22;

const movies = generateMovies(MOVIE_COUNT);
const moviesCount = movies.length;
const watchedMoviesCount = movies.filter(({userDetails: alreadyWatched}) => alreadyWatched).length;
const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new UserRankComponent(watchedMoviesCount));

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const movieListComponent = new MovieListComponent(moviesCount);
const pageController = new PageController(movieListComponent, moviesModel);
render(siteMainElement, movieListComponent);
pageController.render();

const footerStatisticsElement = document.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new MovieCounterComponent(moviesCount));
