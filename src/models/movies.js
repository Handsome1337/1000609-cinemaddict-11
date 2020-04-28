export default class Movies {
  constructor() {
    this._movies = [];
  }

  get movies() {
    return this._movies;
  }

  set movies(movies) {
    this._movies = movies;
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [...this._movies.slice(0, index), movie, ...this._movies.slice(index + 1)];

    return true;
  }
}
