import {FilterType, getMoviesByFilter} from './../utils/filter.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
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
    this._callHandlers(this._filterChangeHandlers);
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [...this._movies.slice(0, index), movie, ...this._movies.slice(index + 1)];

    this._callHandlers(this._dataChangeHandlers);

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
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
