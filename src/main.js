"use strict";

/* Перечисление вариантов вставки элемента */
const RenderPosition = {
  BEFOREEND: 'beforeend'
};

/* В следующих заданиях добавятся другие места вставки,
поэтому использованы перечисление и switch */
const render = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    default:
      container.append(component);
  }
};
