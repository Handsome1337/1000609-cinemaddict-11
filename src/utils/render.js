const RenderPosition = {
  BEFORE: `before`,
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

const render = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.BEFORE:
      container.before(component.getElement());
      break;
    default:
      container.append(component.getElement());
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {RenderPosition, createElement, render, remove};
