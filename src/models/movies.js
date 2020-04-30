import {FilterType, getMoviesByFilter} from './../utils/filter.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = null;
    this._filterChangeHandlers = null;
  }

  getAllMovies() {
    return this._movies;
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  setMovies(movies) {
    this._movies = movies;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandler();
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [...this._movies.slice(0, index), movie, ...this._movies.slice(index + 1)];

    this._dataChangeHandler();

    return true;
  }

  removeComment(commentId, movie) {
    const index = movie.comments.findIndex((it) => it.id === commentId);

    if (index === -1) {
      return false;
    }

    movie.comments = [...movie.comments.slice(0, index), ...movie.comments.slice(index + 1)];

    return this.updateMovie(movie.id, movie);
  }

  addComment(comment, movie) {
    movie.comments = [...movie.comments, comment];

    return this.updateMovie(movie.id, movie);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandler = handler;
  }
}
