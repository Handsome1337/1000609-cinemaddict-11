import SiteMenuComponent from './../components/site-menu.js';
import {FilterType, getMoviesByFilter} from './../utils/filter.js';
import {render, replace} from './../utils/render.js';

export default class SiteMenu {
  constructor(container, moviesModel, onPageChange) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._siteMenuComponent = null;
    this._onPageChange = onPageChange;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setOnStatsClick = this.setOnStatsClick.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getAllMovies();
    const filters = Object.values(FilterType)
      .map((filterType) => {
        return {
          name: filterType,
          count: getMoviesByFilter(allMovies, filterType).length,
          checked: filterType === this._activeFilterType
        };
      });
    const oldComponent = this._siteMenuComponent;

    this._siteMenuComponent = new SiteMenuComponent(filters);
    this._siteMenuComponent.setFilterChangeHandler(this._onFilterChange);

    if (this._onStatsClickHandler) {
      this._siteMenuComponent.setOnStatsClick(this._onStatsClickHandler);
    }

    if (oldComponent) {
      replace(oldComponent, this._siteMenuComponent);
    } else {
      render(container, this._siteMenuComponent);
    }
  }

  _onFilterChange(filterType) {
    this._onPageChange();
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }

  setOnStatsClick(handler) {
    this._siteMenuComponent.setOnStatsClick(handler);

    this._onStatsClickHandler = handler;
  }
}
