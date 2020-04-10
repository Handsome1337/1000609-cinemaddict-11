const filterMap = new Map([
  [`All movies`, `id`],
  [`Watchlist `, `watchlist`],
  [`History`, `alreadyWatched`],
  [`Favorites `, `favorite`]
]);

const generateFilters = (movies) => {
  return [...filterMap.entries()]
    .map(([name, movieProp], i) => {
      return {
        name,
        count: i ? movies.filter((movie) => movie.userDetails[movieProp]).length : movies.length
      };
    });
};

export {generateFilters};
