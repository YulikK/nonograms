import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";

export default class EndGame extends AbstractView {
  constructor(time) {
    super();
    this._time = time;
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._playAgainClickHandler = this._playAgainClickHandler.bind(this);
  }

  getStructure() {
    return {
      element: this._elements.aside,
      child: [
        {
          element: this._elements.window,
          child: [
            {
              element: this._elements.div,
              child: 
                [{element: this._elements.titleWrap,
                    child: 
                      [{element: this._elements.img},
                      {element: this._elements.title}]},
                {element: this._elements.information},
                {element: this._elements.closeBtn,
                child: [{element: this._elements.closeImg}]},
              ],
            },
          ]
        }
      ],
    };
  }
  getElementProperties() {
    return {
      aside: {tag: "aside", className: "modal-results"},
      window: {tag: "div", className: "modal-results__window"},
      div: {tag: "div", className: "modal-results__wrapper"},
      titleWrap: {tag: "div", className: "modal-results__title-wrap"},
      title: {tag: "h2", className: "modal-results__title", textContent: `Great! `},
      img: {tag: 'img', className: 'modal-results__img', src: './img/icons/results.png', alt: `Winner's medal`, width: '40', height: '40'},
      information: {tag: "p", className: "modal-results__information",textContent: `You have solved the nanograms in ${this._time} seconds!`},
      closeBtn: {tag: "a", className: "modal-results__button"},
      closeImg: {tag: 'img', className: 'modal-results__button-img', src: './img/icons/win.png', alt: 'Close window', width: '40', height: '40'}
    }
  }
  generateNode() {
    return {
      aside: createElement(this._tagsProperties.aside),
      window: createElement(this._tagsProperties.window),
      div: createElement(this._tagsProperties.div),
      titleWrap:  createElement(this._tagsProperties.titleWrap),
      title: createElement(this._tagsProperties.title),
      img: createElement(this._tagsProperties.img),
      information: createElement(this._tagsProperties.information),
      closeBtn: createElement(this._tagsProperties.closeBtn),
      closeImg:  createElement(this._tagsProperties.closeImg),
    };
  }

  _playAgainClickHandler(evt) {
    evt.preventDefault();
    this._callback.playAgainClick();
  }

  setPlayAgainClickHandler(callback) {
    this._callback.playAgainClick = callback;
    this._elements.closeBtn.addEventListener(
      `click`,
      this._playAgainClickHandler,
    );
  }
}