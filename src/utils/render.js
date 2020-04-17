const RenderPosition = {
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  if (!template) {
    return ``;
  }

  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    default:
      container.append(element);
  }
};

export {createElement, render};
