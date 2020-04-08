const filterNames = [`All movies`, `Watchlist `, `History `, `Favorites `];

const generateFilters = () => {
  return filterNames
    .map((name) => {
      return {
        name,
        count: Math.floor(Math.random() * 10)
      };
    });
};

export {generateFilters};
