import AbstractComponent from './abstract-component.js';

const MAIN_FILTER = `All movies`;

const createFiltersMarkup = (filters) => {
  return filters
    .reduce((acc, {name, count}, i) => {
      const newline = i === 0 ? `` : `\n`;
      const link = name.toLowerCase().split(` `)[0];
      const isMainFilter = name === MAIN_FILTER;
      const template = (
        `<a href="#${link}" class="main-navigation__item ${isMainFilter ? `main-navigation__item--active` : ``}">
          ${name}${isMainFilter ? `` : `<span class="main-navigation__item-count">${count}</span>`}
        </a>`
      );
      return `${acc}${newline}${template}`;
    }, ``);
};

const createSiteMenuTemplate = (filters) => {
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

export default class SiteMenu extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }
}
