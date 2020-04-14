import {createElement} from './../utils.js';

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

export default class SiteMenu {
  constructor(filters) {
    this._filters = filters;

    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
