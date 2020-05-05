export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getMovies() {
    return this._api.getMovies();
  }

  updateMovie(id, data) {
    return this._api.updateMovie(id, data);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }

  addComment(filmId, comment) {
    return this._api.addComment(filmId, comment);
  }
}
