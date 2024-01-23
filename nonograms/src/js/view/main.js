import AbstractView from './abstract.js';
import { createElement } from '../utils/render.js';

export default class Main extends AbstractView {
  constructor() {
    super();
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
  }
  getStructure() {
    return {
      element: this._elements.main,
      child: [
        {element: this._elements.table.section,
        child: [
          {element: this._elements.table.h2}, 
          {element: this._elements.table.crosswordWrap}]},
        {element: this._elements.additional.section,
        child: [{element: this._elements.additional.h2}]}
      ]
    };
  }
  getElementProperties() {
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
  generateNode() {
    return {
      main: createElement(this._tagsProperties.main),
      table: {
        section: createElement(this._tagsProperties.table.section),
        h2: createElement(this._tagsProperties.table.h2),
        crosswordWrap: createElement(this._tagsProperties.table.crosswordWrap)
      },
      additional: {
        section: createElement(this._tagsProperties.additional.section),
        h2: createElement(this._tagsProperties.additional.h2),
      }
    };
  }
}