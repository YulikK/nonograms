import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";
import { getTime } from "../utils/utils.js";
import CrosswordModel from "../model/crossword.js";

export default class Results extends AbstractView {
  #results;
  #crosswords;
  #tagsProperties;

  constructor(results, crosswords) {
    super();
    this.#results = results.slice().sort(function (a, b) {
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1;
      }
      return 0;
    });
    this.#crosswords = new CrosswordModel();
    this.#crosswords.setCrosswords(crosswords);
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }
  #getStructure() {
    const node = {
      element: this.elements.resultsWrap,
      child: [
        {
          element: this.elements.titleWrap,
          child: [
            { element: this.elements.img },
            { element: this.elements.titleP },
          ],
        },
      ],
    };
    this.elements.results.forEach((elNode) => {
      const newNode = {
        element: elNode.wrapInf,
        child: [
          { element: elNode.resultWrap, child: [{ element: elNode.p }] },
          {
            element: elNode.level.wrap,
            child: Array.from(
              { length: Number(elNode.level.levelNumber) },
              (el, i) => elNode.level[`star${i + 1}`],
            ),
          },
        ],
      };

      node.child.push(newNode);
    });

    return node;
  }
  #getElementProperties() {
    const node = {
      resultsWrap: { tag: "div", className: "game__results results" },
      titleWrap: { tag: "div", className: "results__title-wrapper" },
      img: {
        tag: "img",
        className: "results__img",
        src: "./img/icons/results.png",
        alt: "Results table",
        width: "40",
        height: "40",
      },
      titleP: { tag: "p", className: "results__title", textContent: "Results" },
      wrapInf: { tag: "div", className: "results__information-wrapper" },
      resultWrap: { tag: "div", className: "results__result-wrapper" },
      level: {
        wrap: { tag: "div", className: "results__level-wrapper" },
        star: {
          tag: "img",
          className: "results__level-img",
          src: "./img/icons/level.png",
          alt: "star level",
          width: "40",
          height: "40",
        },
      },
    };
    return node;
  }
  #generateNode() {
    const node = {
      resultsWrap: createElement(this.#tagsProperties.resultsWrap),
      titleWrap: createElement(this.#tagsProperties.titleWrap),
      img: createElement(this.#tagsProperties.img),
      titleP: createElement(this.#tagsProperties.titleP),

      results: [],
    };

    this.#results.forEach((result) => {
      const cross = this.#crosswords.getElementById(result.id);
      const newResultNode = {
        wrapInf: createElement(this.#tagsProperties.wrapInf),
        resultWrap: createElement(this.#tagsProperties.resultWrap),
        p: createElement({
          tag: "p",
          className: "results__information",
          textContent: `${getTime(result.time)} - ${cross.name}`,
        }),
        level: {
          wrap: createElement(this.#tagsProperties.level.wrap),
          levelNumber: cross.level,
        },
      };

      for (let i = 1; i <= cross.level; i += 1) {
        newResultNode.level[`star${i}`] = createElement(
          this.#tagsProperties.level.star,
        );
      }
      node.results.push(newResultNode);
    });
    return node;
  }
}
