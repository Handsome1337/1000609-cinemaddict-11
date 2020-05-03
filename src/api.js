import Movie from './models/movie.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endpoint, authorization) {
    this._endPoint = endpoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then(checkStatus)
      .then((response) => response.json())
      .then((movies) => Promise.all(movies.map((movie) => this._getComments(movie))))
      .then(Movie.parseMovies);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then((movie) => this._getComments(movie))
      .then(Movie.parseMovie);
  }

  _getComments(movie) {
    return this._load({url: `comments/${movie.id}`})
      .then(checkStatus)
      .then((response) => response.json())
      .then((fullComments) => Object.assign({}, movie, {comments: fullComments}));
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

