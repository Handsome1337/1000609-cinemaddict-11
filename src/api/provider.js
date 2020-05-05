import Movie from './../models/movie.js';
import {nanoid} from 'nanoid';
import humanNames from 'human-names';

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedMovies = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = movies.reduce((acc, current) => {
            return Object.assign({}, acc, {
              [current.id]: current,
            });
          }, {});

          this._store.setItems(items);

          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  updateMovie(id, data) {
    if (isOnline()) {
      return this._api.updateMovie(id, data)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    const localMovie = Movie.clone(Object.assign(data, {id}));

    this._store.setItem(id, localMovie.toRAW());

    return Promise.resolve(localMovie);
  }

  deleteComment(commentId, movie) {
    const localMovie = Movie.clone(Object.assign(Movie.clone(movie), movie, {comments: movie.comments.filter(({id}) => id !== commentId)}));

    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => {
          this._store.setItem(movie.id, localMovie.toRAW());
        });
    }

    this._store.setItem(movie.id, localMovie.toRAW());

    return Promise.resolve();
  }

  addComment(movie, comment) {
    if (isOnline()) {
      return this._api.addComment(movie, comment)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }

    const localNewCommentId = nanoid();
    const localNewCommentAuthor = humanNames.allRandom();
    const localMovie = Movie.clone(Object.assign(Movie.clone(movie), movie, {comments: [...movie.comments, Object.assign(comment, {id: localNewCommentId, author: localNewCommentAuthor})]}));

    this._store.setItem(movie.id, localMovie.toRAW());

    return Promise.resolve(localMovie);
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems());

      return this._api.sync(storeMovies)
        .then(({updated}) => {
          const updatedMovies = getSyncedMovies(updated);
          const items = createStoreStructure([...updatedMovies, ...storeMovies]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
