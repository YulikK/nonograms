import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";

export default class Gallery extends AbstractView {
  #crosswords;
  #tagsProperties;

  constructor(crosswords) {
    super();
    this.#crosswords = crosswords;
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }

  setCloseClickHandler(callback) {
    this.callback.closeClick = callback;
    this.elements.closeBtn.addEventListener(`click`, this.#closeClickHandler);
    return this;
  }

  setGameClickHandler(callback) {
    this.callback.gameClick = callback;
    this.elements.gallery.forEach((game) => {
      game.exWrap.addEventListener(`click`, this.#gameClickHandler);
    });
    return this;
  }
  #getStructure() {
    const nodeList = [];
    this.elements.gallery.forEach((elNode) => {
      const newNode = {
        element: elNode.exWrap,
        child: [
          { element: elNode.exImg },
          { element: elNode.exName },
          {
            element: elNode.level.wrap,
            child: Array.from(
              { length: Number(elNode.level.levelNumber) },
              (el, i) => elNode.level[`star${i + 1}`],
            ),
          },
        ],
      };

      nodeList.push(newNode);
    });

    const node = {
      element: this.elements.aside,
      child: [
        {
          element: this.elements.window,
          child: [
            {
              element: this.elements.windowWrap,
              child: [
                {
                  element: this.elements.titleWrap,
                  child: [
                    { element: this.elements.title },
                    {
                      element: this.elements.closeBtn,
                      child: [{ element: this.elements.closeImg }],
                    },
                  ],
                },
                { element: this.elements.galleryWrap, child: nodeList },
              ],
            },
          ],
        },
      ],
    };

    return node;
  }
  #getElementProperties() {
    return {
      aside: { tag: "aside", className: "modal-gallery" },
      window: { tag: "div", className: "modal-gallery__window" },
      windowWrap: { tag: "div", className: "modal-gallery__wrapper" },
      titleWrap: { tag: "div", className: "modal-gallery__title-wrap" },
      title: {
        tag: "h2",
        className: "modal-gallery__title",
        textContent: `Gallery`,
      },
      closeBtn: { tag: "a", className: "modal-gallery__button" },
      closeImg: {
        tag: "img",
        className: "modal-gallery__button-img",
        src: "./img/icons/close.png",
        alt: "Close window",
        width: "40",
        height: "40",
      },
      galleryWrap: { tag: "div", className: "modal-gallery__gallery-wrap" },
      levelWrap: { tag: "div", className: "modal-gallery__level-wrapper" },
      star: {
        tag: "img",
        className: "modal-gallery__level-img",
        src: "./img/icons/level.png",
        alt: "star level",
        width: "40",
        height: "40",
      },
    };
  }
  #generateNode() {
    const node = {
      aside: createElement(this.#tagsProperties.aside),
      window: createElement(this.#tagsProperties.window),
      windowWrap: createElement(this.#tagsProperties.windowWrap),
      titleWrap: createElement(this.#tagsProperties.titleWrap),
      title: createElement(this.#tagsProperties.title),
      closeBtn: createElement(this.#tagsProperties.closeBtn),
      closeImg: createElement(this.#tagsProperties.closeImg),
      galleryWrap: createElement(this.#tagsProperties.galleryWrap),
      gallery: [],
    };

    this.#crosswords.forEach((element) => {
      const newNode = {
        exWrap: createElement({
          tag: "div",
          className: "modal-gallery__example-wrap",
          data: `${element.id}`,
        }),
        exImg: createElement({
          tag: "img",
          className: "modal-gallery__example-img",
          src: `./img/example/${element.img}.png`,
          alt: `${element.name}`,
          width: "40",
          height: "40",
        }),
        exName: createElement({
          tag: "p",
          className: "modal-gallery__example-name",
          textContent: `${element.name}`,
        }),
        level: {
          wrap: createElement(this.#tagsProperties.levelWrap),
          levelNumber: element.level,
        },
      };

      for (let i = 1; i <= element.level; i += 1) {
        newNode.level[`star${i}`] = createElement(this.#tagsProperties.star);
      }

      node.gallery.push(newNode);
    });

    return node;
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.closeClick();
  };

  #gameClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.gameClick(evt.currentTarget.data);
  };
}
