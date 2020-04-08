const MAIN_FILTER = `All movies`;

const createFiltersMarkup = (filters) => {
  return filters
    .map(({name, count}) => {
      const link = name.toLowerCase().split(` `)[0];
      const isMainFilter = name === MAIN_FILTER;

      return (
        `<a href="#${link}" class="main-navigation__item ${isMainFilter ? `main-navigation__item--active` : ``}">
          ${name}${isMainFilter ? `` : `<span class="main-navigation__item-count">${count}</span>`}
        </a>`
      );
    })
    .join(`\n`);
};

export const createSiteMenuTemplate = (filters) => {
  const filtersMarkup = createFiltersMarkup(filters);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
