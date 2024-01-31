import AbstractView from './abstract.js';
import { createElement } from '../utils/render.js';

export default class Chose extends AbstractView {
  #crossword;
  #tagsProperties;

  constructor(crossword) {
    super();
    this.#crossword = crossword;
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }
  #getStructure() {
    return {
      element: this.elements.choseWrap,
      child: [
        {element: this.elements.chose.wrap,
        child: [
          {element: this.elements.chose.imgWrap,
            child: [{element: this.elements.chose.img}]},
          {element: this.elements.chose.titleWrap,
            child: [{element: this.elements.chose.title}]},
          {element: this.elements.chose.level.wrap,
            child: Array.from({ length: this.#crossword.level }, (el, i) => this.elements.chose.level[`star${i + 1}`])},
        ]},
        {element: this.elements.random.a,
          child: [{element: this.elements.random.img}]}
        ]};
  }

  #getElementProperties() {
    return {
      choseWrap: {
        tag: 'div',
        className: 'game__chose-wrapper'
      },
      chose: {
        wrap: {tag: 'div', className: 'game__chose chose'},
        imgWrap: {tag: 'div', className: 'chose__img-wrapper'},
        img: {tag: 'img', className: 'chose__img', src: `./img/example/${this.#crossword.img}.png`, alt: 'Chose the game', width: '40', height: '40'},
        titleWrap: {tag: 'div', className: 'chose__title-wrapper'},
        title: {tag: 'p', className: 'chose__title', textContent: `${this.#crossword.name}`},
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

  #generateNode() {
    const node = {
      choseWrap: createElement(this.#tagsProperties.choseWrap),
      chose: {
        wrap: createElement(this.#tagsProperties.chose.wrap),
        imgWrap: createElement(this.#tagsProperties.chose.imgWrap),
        img: createElement(this.#tagsProperties.chose.img),
        titleWrap: createElement(this.#tagsProperties.chose.titleWrap),
        title: createElement(this.#tagsProperties.chose.title),
        level: {
          wrap: createElement(this.#tagsProperties.chose.level.wrap),
        }
      },
      random: {
        a: createElement(this.#tagsProperties.random.a),
        img: createElement(this.#tagsProperties.random.img),
      }
    };
  
    for(let i = 1; i <= this.#crossword.level; i+=1) {
      node.chose.level[`star${i}`] = createElement(this.#tagsProperties.chose.level.star);
    }

    return node;
  }

  #randomClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.randomClick();
  }

  #showGalleryClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.showGallery();
  }

  setRandomClickHandler(callback) {
    this.callback.randomClick = callback;
    this.elements.random.a.addEventListener(`click`, this.#randomClickHandler);
  }

  setShowGalleryClickHandler(callback) {
    this.callback.showGallery = callback;
    this.elements.chose.wrap.addEventListener(`click`, this.#showGalleryClickHandler);
  }
}