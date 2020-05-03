export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.filmInfo = {
      title: data[`film_info`][`title`],
      alternativeTitle: data[`film_info`][`alternative_title`],
      totalRating: data[`film_info`][`total_rating`],
      poster: data[`film_info`][`poster`],
      ageRating: [`film_info`][`age_rating`],
      director: [`film_info`][`director`],
      writers: new Set(data[`film_info`][`writers`]),
      actors: new Set(data[`film_info`][`actors`]),
      release: {
        date: data[`film_info`][`release`][`date`],
        releaseCountry: data[`film_info`][`release`][`release_country`],
      },
      runtime: data[`film_info`][`runtime`],
      genre: new Set(data[`film_info`][`genre`]),
      description: data[`film_info`][`description`],
    };
    this.userDetails = {
      watchlist: data[`user_details`][`watchlist`],
      alreadyWatched: data[`user_details`][`already_watched`],
      watchingDate: data[`user_details`][`watching_date`],
      favorite: data[`user_details`][`favorite`]
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }
}
