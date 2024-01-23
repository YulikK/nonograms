import AbstractView from './abstract.js';
import { createElement } from '../utils/render.js';

export default class Chose extends AbstractView {
  constructor(crossword) {
    super();
    this._crossword = crossword
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._randomClickHandler = this._randomClickHandler.bind(this);
  }
  getStructure() {
    return {
      element: this._elements.choseWrap,
      child: [
        {element: this._elements.chose.wrap,
        child: [
          {element: this._elements.chose.imgWrap,
            child: [{element: this._elements.chose.img}]},
          {element: this._elements.chose.titleWrap,
            child: [{element: this._elements.chose.title}]},
          {element: this._elements.chose.level.wrap,
            child: Array.from({ length: this._crossword.level }, (el, i) => this._elements.chose.level[`star${i + 1}`])},
        ]},
        {element: this._elements.random.a,
          child: [{element: this._elements.random.img}]}
        ]};
  }

  getElementProperties() {
    return {
      choseWrap: {
        tag: 'div',
        className: 'game__chose-wrapper'
      },
      chose: {
        wrap: {tag: 'div', className: 'game__chose chose'},
        imgWrap: {tag: 'div', className: 'chose__img-wrapper'},
        img: {tag: 'img', className: 'chose__img', src: './img/icons/open.png', alt: 'Chose the game', width: '40', height: '40'},
        titleWrap: {tag: 'div', className: 'chose__title-wrapper'},
        title: {tag: 'p', className: 'chose__title', textContent: `${this._crossword.name}`},
        level: {
          wrap: {tag: 'div', className: 'chose__level-wrapper'},
          star: {tag: 'img', className: 'chose__level-img', src: './img/icons/level.png', alt: 'star level', width: '40', height: '40'}
        }
      },
      random: {
        a: {tag: 'a', className: 'game__random', href: ''},
        img: {tag: 'img', className: 'game__random-img', src: './img/icons/random.png', alt: 'random game', width: '40', height: '40'},
      }
    };
  }

  generateNode() {
    const node = {
      choseWrap: createElement(this._tagsProperties.choseWrap),
      chose: {
        wrap: createElement(this._tagsProperties.chose.wrap),
        imgWrap: createElement(this._tagsProperties.chose.imgWrap),
        img: createElement(this._tagsProperties.chose.img),
        titleWrap: createElement(this._tagsProperties.chose.titleWrap),
        title: createElement(this._tagsProperties.chose.title),
        level: {
          wrap: createElement(this._tagsProperties.chose.level.wrap),
        }
      },
      random: {
        a: createElement(this._tagsProperties.random.a),
        img: createElement(this._tagsProperties.random.img),
      }
    };
  
    for(let i = 1; i <= this._crossword.level; i+=1) {
      node.chose.level[`star${i}`] = createElement(this._tagsProperties.chose.level.star);
    }

    return node;
  }
  _randomClickHandler(evt) {
    evt.preventDefault();
    this._callback.randomClick();
  }
  setRandomClickHandler(callback) {
    this._callback.randomClick = callback;
    this._elements.random.a.addEventListener(`click`, this._randomClickHandler);
  }
}