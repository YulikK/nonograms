import AbstractView from './abstract.js';
import { createElement } from '../utils/render.js';

export default class Main extends AbstractView {
  #tagsProperties;

  constructor() {
    super();
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }
  #getStructure() {
    return {
      element: this.elements.main,
      child: [
        {element: this.elements.table.section,
        child: [
          {element: this.elements.table.h2}, 
          {element: this.elements.table.crosswordWrap}]},
        {element: this.elements.additional.section,
        child: [{element: this.elements.additional.h2}]}
      ]
    };
  }
  #getElementProperties() {
    return {
      main: {
        tag: 'main',
        className: 'game__wrapper'
      },
      table: {
        section: {
          tag: 'section',
          className: 'game__table table'
        },
        h2: {
          tag: 'h2',
          className: 'visually-hidden',
          textContent: 'Game table'
        },
        crosswordWrap: {
          tag: 'div',
          className: 'game__crossword-wrapper'
        }
      },
      additional: {
        section: {
          tag: 'section',
          className: 'game__additional'
        },
        h2: {
          tag: 'h2',
          className: 'visually-hidden',
          textContent: 'Additional information'
        },
        
      }
    }
  }
  #generateNode() {
    return {
      main: createElement(this.#tagsProperties.main),
      table: {
        section: createElement(this.#tagsProperties.table.section),
        h2: createElement(this.#tagsProperties.table.h2),
        crosswordWrap: createElement(this.#tagsProperties.table.crosswordWrap)
      },
      additional: {
        section: createElement(this.#tagsProperties.additional.section),
        h2: createElement(this.#tagsProperties.additional.h2),
      }
    };
  }
}