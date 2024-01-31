import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";

export default class EndWin extends AbstractView {
  #time;
  #tagsProperties;

  constructor(time) {
    super();
    this.#time = time;
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }

  #getStructure() {
    return {
      element: this.elements.aside,
      child: [
        {
          element: this.elements.window,
          child: [
            {
              element: this.elements.div,
              child: 
                [{element: this.elements.titleWrap,
                    child: 
                      [{element: this.elements.img},
                      {element: this.elements.title}]},
                {element: this.elements.information},
                {element: this.elements.closeBtn,
                child: [{element: this.elements.closeImg}]},
              ],
            },
          ]
        }
      ],
    };
  }
  #getElementProperties() {
    return {
      aside: {tag: "aside", className: "modal-results"},
      window: {tag: "div", className: "modal-results__window"},
      div: {tag: "div", className: "modal-results__wrapper"},
      titleWrap: {tag: "div", className: "modal-results__title-wrap"},
      title: {tag: "h2", className: "modal-results__title", textContent: `Great! `},
      img: {tag: 'img', className: 'modal-results__img', src: './img/icons/results.png', alt: `Winner's medal`, width: '40', height: '40'},
      information: {tag: "p", className: "modal-results__information",textContent: `You have solved the nanograms in ${this.#time} seconds!`},
      closeBtn: {tag: "a", className: "modal-results__button"},
      closeImg: {tag: 'img', className: 'modal-results__button-img', src: './img/icons/win.png', alt: 'Close window', width: '40', height: '40'}
    }
  }
  #generateNode() {
    return {
      aside: createElement(this.#tagsProperties.aside),
      window: createElement(this.#tagsProperties.window),
      div: createElement(this.#tagsProperties.div),
      titleWrap:  createElement(this.#tagsProperties.titleWrap),
      title: createElement(this.#tagsProperties.title),
      img: createElement(this.#tagsProperties.img),
      information: createElement(this.#tagsProperties.information),
      closeBtn: createElement(this.#tagsProperties.closeBtn),
      closeImg:  createElement(this.#tagsProperties.closeImg),
    };
  }

  #playAgainClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.playAgainClick();
  }

  setPlayAgainClickHandler(callback) {
    this.callback.playAgainClick = callback;
    this.elements.closeBtn.addEventListener(
      `click`,
      this.#playAgainClickHandler,
    );
  }
}