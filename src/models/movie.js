export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.filmInfo = {
      title: data[`film_info`][`title`],
      alternativeTitle: data[`film_info`][`alternative_title`],
      totalRating: data[`film_info`][`total_rating`],
      poster: data[`film_info`][`poster`],
      ageRating: data[`film_info`][`age_rating`],
      director: data[`film_info`][`director`],
      writers: data[`film_info`][`writers`],
      actors: data[`film_info`][`actors`],
      release: {
        date: data[`film_info`][`release`][`date`],
        releaseCountry: data[`film_info`][`release`][`release_country`],
      },
      runtime: data[`film_info`][`runtime`],
      genre: data[`film_info`][`genre`],
      description: data[`film_info`][`description`],
    };
    this.userDetails = {
      watchlist: data[`user_details`][`watchlist`],
      alreadyWatched: data[`user_details`][`already_watched`],
      watchingDate: data[`user_details`][`watching_date`],
      favorite: data[`user_details`][`favorite`]
    };
  }

  static toRAW(data, clone = false) {
    return {
      "id": data.id,
      "comments": clone ? data.comments : data.comments.map(({id}) => id),
      "film_info": {
        "title": data.filmInfo.title,
        "alternative_title": data.filmInfo.alternativeTitle,
        "total_rating": data.filmInfo.totalRating,
        "poster": data.filmInfo.poster,
        "age_rating": data.filmInfo.ageRating,
        "director": data.filmInfo.director,
        "writers": data.filmInfo.writers,
        "actors": data.filmInfo.actors,
        "release": {
          "date": data.filmInfo.release.date,
          "release_country": data.filmInfo.release.releaseCountry
        },
        "runtime": data.filmInfo.runtime,
        "genre": data.filmInfo.genre,
        "description": data.filmInfo.description
      },
      "user_details": {
        "watchlist": data.userDetails.watchlist,
        "already_watched": data.userDetails.alreadyWatched,
        "watching_date": data.userDetails.watchingDate,
        "favorite": data.userDetails.favorite
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(this.toRAW(data, true));
  }
}
