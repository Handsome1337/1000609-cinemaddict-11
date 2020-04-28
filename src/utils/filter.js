const FilterType = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist `,
  HISTORY: `History `,
  FAVORITES: `Favorites `
};

const getWatchlistMovies = (movies) => movies.filter((movie) => movie.userDetails.watchlist);

const getWatchedMovies = (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched);

const getFavoriteMovies = (movies) => movies.filter((movie) => movie.userDetails.favorite);

const getMoviesByFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return getWatchlistMovies(movies);
    case FilterType.HISTORY:
      return getWatchedMovies(movies);
    case FilterType.FAVORITES:
      return getFavoriteMovies(movies);
    default:
      return movies;
  }
};

export {FilterType, getMoviesByFilter};
