import AbstractComponent from './abstract-component.js';

const MAIN_FILTER = `All movies`;

const getFilterName = (element) => element.innerText.replace(/[0-9]/g, ``);

const createFiltersMarkup = (filters) => {
  return filters
    .reduce((acc, {name, count, checked}, i) => {
      const newline = i === 0 ? `` : `\n`;
      const link = name.toLowerCase().split(` `)[0];
      const isMainFilter = name === MAIN_FILTER;
      const template = (
        `<a href="#${link}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}">
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

  setFilterChangeHandler(handler) {
    this.getElement().querySelector(`.main-navigation__items`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const target = evt.target;
        const tag = target.tagName;

        /* Проверка на наличие класса нужна для того, чтобы фильтрация не выполнялась при клике на уже активный фильтр */
        if ((tag !== `A` && tag !== `SPAN`) || (target.classList.contains(`main-navigation__item--active`) || target.parentElement.classList.contains(`main-navigation__item--active`))) {
          return;
        }

        const filterName = tag === `A` ? getFilterName(target) : getFilterName(target.parentElement);

        const lastFilterLinkElement = this.getElement().querySelector(`.main-navigation__item--active`);

        if (lastFilterLinkElement) {
          lastFilterLinkElement.classList.remove(`main-navigation__item--active`);
        } else {
          this.getElement().querySelector(`.main-navigation__additional--active`).classList.remove(`main-navigation__additional--active`);
        }

        if (tag === `A`) {
          target.classList.add(`main-navigation__item--active`);
        } else {
          target.parentElement.classList.add(`main-navigation__item--active`);
        }

        handler(filterName);
      });
  }

  setOnStatsClick(handler) {
    this.getElement().querySelector(`.main-navigation__additional`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (evt.target.classList.contains(`main-navigation__additional--active`)) {
          return;
        }

        this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
        evt.target.classList.add(`main-navigation__additional--active`);

        handler();
      });
  }
}
