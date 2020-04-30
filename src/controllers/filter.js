import SiteMenuComponent from './../components/site-menu.js';
import {FilterType, getMoviesByFilter} from './../utils/filter.js';
import {render, replace} from './../utils/render.js';

export default class Filter {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._siteMenuComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

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

    if (oldComponent) {
      replace(oldComponent, this._siteMenuComponent);
    } else {
      render(container, this._siteMenuComponent);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
