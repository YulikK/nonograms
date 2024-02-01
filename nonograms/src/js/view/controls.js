import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";

export default class Controls extends AbstractView {
  #tagsProperties = this.#getElementProperties();
  elements = this.#generateNode();
  structure = this.#getStructure();

  #getStructure() {
    return {
      element: this.elements.header,
      child: [
        { element: this.elements.h1 },
        {
          element: this.elements.options.wrap,
          child: [
            {
              element: this.elements.options.refresh.a,
              child: [{ element: this.elements.options.refresh.img }],
            },
            {
              element: this.elements.options.showAnswer.a,
              child: [{ element: this.elements.options.showAnswer.img }],
            },
            {
              element: this.elements.options.saveLoad.wrap,
              child: [
                {
                  element: this.elements.options.saveLoad.save,
                  child: [{ element: this.elements.options.saveLoad.saveImg }],
                },
                {
                  element: this.elements.options.saveLoad.load,
                  child: [{ element: this.elements.options.saveLoad.loadImg }],
                },
              ],
            },
          ],
        },
        {
          element: this.elements.settings.wrap,
          child: [
            {
              element: this.elements.settings.sound.label,
              child: [
                { element: this.elements.settings.sound.input },
                { element: this.elements.settings.sound.span },
              ],
            },
            {
              element: this.elements.settings.theme.label,
              child: [
                { element: this.elements.settings.theme.input },
                { element: this.elements.settings.theme.span },
              ],
            },
          ],
        },
      ],
    };
  }
  #getElementProperties() {
    return {
      header: { tag: "header", className: "game__control control" },
      h1: {
        tag: "h1",
        textContent: "Nanograms game",
        className: "visually-hidden",
      },
      options: {
        wrap: { tag: "div", className: "control__options options" },
        refresh: {
          a: { tag: "a", className: "options__refresh", href: "" },
          img: {
            tag: "img",
            className: "options__refresh-img",
            src: "./img/icons/refresh.png",
            alt: "refresh",
            width: "40",
            height: "40",
          },
        },
        showAnswer: {
          a: { tag: "a", className: "options__show-answer", href: "" },
          img: {
            tag: "img",
            className: "options__show-answer-img",
            src: "./img/icons/show-answers.png",
            alt: "show-answer",
            width: "40",
            height: "40",
          },
        },
        saveLoad: {
          wrap: { tag: "div", className: "options__save-load" },
          save: { tag: "a", className: "options__save disable", href: "" },
          saveImg: {
            tag: "img",
            className: "options__save-img",
            src: "./img/icons/save.png",
            alt: "save game",
            width: "40",
            height: "40",
          },
          load: { tag: "a", className: "options__load disable", href: "" },
          loadImg: {
            tag: "img",
            className: "options__load-img",
            src: "./img/icons/open.png",
            alt: "load last game",
            width: "40",
            height: "40",
          },
        },
      },
      settings: {
        wrap: { tag: "div", className: "control__settings settings" },
        sound: {
          label: {
            tag: "label",
            id: "switch-sound",
            className: "settings__sound sound",
          },
          input: {
            tag: "input",
            className: "sound__input",
            type: "checkbox",
            id: "slider-sound",
          },
          span: { tag: "span", className: "sound__slider round" },
        },
        theme: {
          label: {
            tag: "label",
            id: "switch-theme",
            className: "settings__theme theme",
          },
          input: {
            tag: "input",
            className: "theme__input",
            type: "checkbox",
            id: "slider-theme",
          },
          span: { tag: "span", className: "theme__slider round" },
        },
      },
    };
  }
  #generateNode() {
    return {
      header: createElement(this.#tagsProperties.header),
      h1: createElement(this.#tagsProperties.h1),
      options: {
        wrap: createElement(this.#tagsProperties.options.wrap),
        refresh: {
          a: createElement(this.#tagsProperties.options.refresh.a),
          img: createElement(this.#tagsProperties.options.refresh.img),
        },
        showAnswer: {
          a: createElement(this.#tagsProperties.options.showAnswer.a),
          img: createElement(this.#tagsProperties.options.showAnswer.img),
        },
        saveLoad: {
          wrap: createElement(this.#tagsProperties.options.saveLoad.wrap),
          save: createElement(this.#tagsProperties.options.saveLoad.save),
          saveImg: createElement(this.#tagsProperties.options.saveLoad.saveImg),
          load: createElement(this.#tagsProperties.options.saveLoad.load),
          loadImg: createElement(this.#tagsProperties.options.saveLoad.loadImg),
        },
      },
      settings: {
        wrap: createElement(this.#tagsProperties.settings.wrap),
        sound: {
          label: createElement(this.#tagsProperties.settings.sound.label),
          input: createElement(this.#tagsProperties.settings.sound.input),
          span: createElement(this.#tagsProperties.settings.sound.span),
        },
        theme: {
          label: createElement(this.#tagsProperties.settings.theme.label),
          input: createElement(this.#tagsProperties.settings.theme.input),
          span: createElement(this.#tagsProperties.settings.theme.span),
        },
      },
    };
  }

  setSaveEnabled() {
    this.elements.options.saveLoad.save.classList.remove("disable");
  }

  setLoadEnable() {
    this.elements.options.saveLoad.load.classList.remove("disable");
  }

  #refreshClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.refreshClick();
  };

  #showAnswersClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.showAnswers();
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.saveClick();
  };

  #loadClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.loveClick();
  };

  #themeClickHandler = () => {
    this.callback.themeClick();
  };

  #soundClickHandler = () => {
    this.callback.soundClick();
  };

  setRefreshClickHandler(callback) {
    this.callback.refreshClick = callback;
    this.elements.options.refresh.a.addEventListener(
      `click`,
      this.#refreshClickHandler,
    );
  }

  setShowAnswersClickHandler(callback) {
    this.callback.showAnswers = callback;
    this.elements.options.showAnswer.a.addEventListener(
      `click`,
      this.#showAnswersClickHandler,
    );
  }

  setSaveClickHandler(callback) {
    this.callback.saveClick = callback;
    this.elements.options.saveLoad.save.addEventListener(
      `click`,
      this.#saveClickHandler,
    );
  }

  setLoadClickHandler(callback) {
    this.callback.loveClick = callback;
    this.elements.options.saveLoad.load.addEventListener(
      `click`,
      this.#loadClickHandler,
    );
  }
  setThemeClickHandler(callback) {
    this.callback.themeClick = callback;
    this.elements.settings.theme.input.addEventListener(
      `click`,
      this.#themeClickHandler,
    );
  }
  setSoundClickHandler(callback) {
    this.callback.soundClick = callback;
    this.elements.settings.sound.input.addEventListener(
      `click`,
      this.#soundClickHandler,
    );
  }
}
