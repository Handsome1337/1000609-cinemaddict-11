import NoMoviesComponent from './../components/no-movies.js';
import MovieCardComponent from './../components/movie-card.js';
import MovieDetailsComponent from './../components/movie-details.js';
import ShowMoreButtonComponent from './../components/show-more-button.js';
import ExtraMovieListComponent from './../components/extra-movie-list.js';
import {render, remove} from './../utils/render.js';

const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

const renderMovieCard = (movieListElement, movie) => {
  const movieCardComponent = new MovieCardComponent(movie);
  const movieDetailsComponent = new MovieDetailsComponent(movie);

  /* Добавляет обработчик клика, вызывающий показ попапа с подробной информацией о фильме */
  movieCardComponent.setOnDetailsOpenersClick(() => {
    render(document.body, movieDetailsComponent);
    /* Добавляет обработчик клика, вызывающий удаление попапа с подробной информацией о фильме */
    movieDetailsComponent.setOnCloseButtonClick(removeDetails);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const removeDetails = () => {
    remove(movieDetailsComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      removeDetails();
    }
  };

  render(movieListElement, movieCardComponent);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noMoviesComponent = new NoMoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(movies) {
    const container = this._container.getElement();
    const movieListElement = container.querySelector(`.films-list`);

    if (!movies.length) {
      render(movieListElement, this._noMoviesComponent);
      return;
    }

    const majorMovieListElement = movieListElement.querySelector(`.films-list__container`);

    let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    movies
      .slice(0, showingMoviesCount)
      .forEach((movie) => {
        renderMovieCard(majorMovieListElement, movie);
      });

    render(movieListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setOnClick(() => {
      const prevMoviesCount = showingMoviesCount;
      showingMoviesCount += SHOWING_MOVIES_COUNT_BY_BUTTON;

      movies
        .slice(prevMoviesCount, showingMoviesCount)
        .forEach((movie) => {
          renderMovieCard(majorMovieListElement, movie);
        });

      if (showingMoviesCount >= movies.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    const topRatedMovies = [...movies].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, 2);
    const mostCommentedMovies = [...movies].sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);

    render(container, new ExtraMovieListComponent(`Top rated`));
    render(container, new ExtraMovieListComponent(`Most commented`));

    const [topRatedMovieListElement, mostCommentedMovieListElement] = document.querySelectorAll(`.films-list--extra .films-list__container`);

    topRatedMovies.forEach((movie) => renderMovieCard(topRatedMovieListElement, movie));
    mostCommentedMovies.forEach((movie) => renderMovieCard(mostCommentedMovieListElement, movie));
  }
}
