import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";

export default class Gallery extends AbstractView {
  constructor(crosswords) {
    super();
    this._crosswords = crosswords;
    // this._crossword = crossword;
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._gameClickHandler = this._gameClickHandler.bind(this);
  }

  getStructure() {
    const nodeList = [];
    this._elements.gallery.forEach(elNode => {
      const newNode = {
        element: elNode.exWrap,
          child: [
            {element: elNode.exImg},
            {element: elNode.exName},
            {element: elNode.level.wrap,
              child: Array.from({ length: Number(elNode.level.levelNumber) }, (el, i) => elNode.level[`star${i + 1}`])
            }
          ]
        };

        nodeList.push(newNode);
    })

    const node = {
      element: this._elements.aside,
      child: [
        {
          element: this._elements.window,
          child: [
            {
              element: this._elements.windowWrap,
              child: 
                [{element: this._elements.titleWrap,
                    child: 
                      [{element: this._elements.title},
                      {element: this._elements.closeBtn,
                        child: [{element: this._elements.closeImg}]}]},
                {element: this._elements.galleryWrap,
                  child: nodeList},
              ],
            },
          ]
        }
      ],
    };

    
    return node;
  }
  getElementProperties() {
    return {
      aside: {tag: "aside", className: "modal-gallery"},
      window: {tag: "div", className: "modal-gallery__window"},
      windowWrap: {tag: "div", className: "modal-gallery__wrapper"},
      titleWrap: {tag: "div", className: "modal-gallery__title-wrap"},
      title: {tag: "h2", className: "modal-gallery__title", textContent: `Gallery`},
      closeBtn: {tag: "a", className: "modal-gallery__button"},
      closeImg: {tag: 'img', className: 'modal-gallery__button-img', src: './img/icons/close.png', alt: 'Close window', width: '40', height: '40'},
      galleryWrap: {tag: "div", className: "modal-gallery__gallery-wrap"},
      levelWrap: {tag: 'div', className: 'modal-gallery__level-wrapper'},
      star: {tag: 'img', className: 'modal-gallery__level-img', src: './img/icons/level.png', alt: 'star level', width: '40', height: '40'}
    }
  }
  generateNode() {
    const node = {
      aside: createElement(this._tagsProperties.aside),
      window: createElement(this._tagsProperties.window),
      windowWrap: createElement(this._tagsProperties.windowWrap),
      titleWrap:  createElement(this._tagsProperties.titleWrap),
      title: createElement(this._tagsProperties.title),
      closeBtn: createElement(this._tagsProperties.closeBtn),
      closeImg:  createElement(this._tagsProperties.closeImg),
      galleryWrap: createElement(this._tagsProperties.galleryWrap),
      gallery: [],
      };

    this._crosswords.forEach(element => {
      const newNode = {
        exWrap: createElement({tag: "div", className: "modal-gallery__example-wrap", data: `${element.id}`}),
        exImg: createElement({tag: 'img', className: 'modal-gallery__example-img', src: `./img/example/${element.img}.png`, alt: `${element.name}`, width: '40', height: '40'}),
        exName: createElement({tag: "p", className: "modal-gallery__example-name",textContent: `${element.name}`}),
        level: {
          wrap: createElement(this._tagsProperties.levelWrap),
          levelNumber: element.level
        }
      }

      for(let i = 1; i <= element.level; i+=1) {
        newNode.level[`star${i}`] = createElement(this._tagsProperties.star);
      }

      node.gallery.push(newNode);
    });

    return node;
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _gameClickHandler(evt) {
    evt.preventDefault();
    this._callback.gameClick(evt.currentTarget.data);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this._elements.closeBtn.addEventListener(
      `click`,
      this._closeClickHandler,
    );
  }
  setGameClickHandler(callback) {
    this._callback.gameClick = callback;
    this._elements.gallery.forEach(game => {
      game.exWrap.addEventListener(
        `click`,
        this._gameClickHandler,
      )
    })
  };
}