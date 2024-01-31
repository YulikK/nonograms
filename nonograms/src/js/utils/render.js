import Abstract from "../view/abstract.js";

export const render = (container, child) => {
  const containerEl = getElement(container);
  const childEl = getElement(child);

  containerEl.append(childEl);

  renderChild(childEl, getChild(child, childEl));
};

const renderChild = (container, childList) => {
  if (childList) {
    childList.forEach((childItem) => {
      if (Array.isArray(childItem.element)) {
        childItem.element.forEach((el) => render(container, el));
      } else render(container, childItem);
    });
  }
};

const getElement = (container) => {
  let element = container;
  if (element.structure) element = element.structure;
  while (element.element) {
    element = element.element;
  }
  return element;
};

const getChild = (node, element) => {
  let currentNode = node.structure ? node.structure : node.element;
  let child = node.child ? node.child : undefined;
  if (!child && currentNode) {
    while (currentNode.child) {
      if (currentNode.element === element) {
        child = currentNode.child;
        break;
      }
      currentNode = currentNode.child;
    }
  }
  return child;
};

export const createElement = (properties) => {
  const newElement = Object.assign(
    document.createElement(properties.tag),
    properties,
  );

  return newElement;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};