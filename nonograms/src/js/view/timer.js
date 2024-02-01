import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";

export default class Timer extends AbstractView {
  #tagsProperties = this.#getElementProperties();
  elements = this.#generateNode();
  structure = this.#getStructure();

  #getStructure() {
    return {
      element: this.elements.wrap,
      child: [
        {
          element: this.elements.imgWrap,
          child: [{ element: this.elements.img }],
        },
        {
          element: this.elements.timeWrap,
          child: [{ element: this.elements.time }],
        },
      ],
    };
  }

  #getElementProperties() {
    return {
      wrap: { tag: "div", className: "options__timer timer" },
      imgWrap: { tag: "div", className: "timer__img-wrapper" },
      img: {
        tag: "img",
        className: "timer__img",
        src: "./img/icons/timer.png",
        alt: "timer",
        width: "40",
        height: "40",
      },
      timeWrap: { tag: "div", className: "timer__time-wrapper" },
      time: { tag: "p", className: "timer__time", textContent: "0:00" },
    };
  }

  #generateNode() {
    return {
      wrap: createElement(this.#tagsProperties.wrap),
      imgWrap: createElement(this.#tagsProperties.imgWrap),
      img: createElement(this.#tagsProperties.img),
      timeWrap: createElement(this.#tagsProperties.timeWrap),
      time: createElement(this.#tagsProperties.time),
    };
  }

  updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    this.elements.time.textContent = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }
}
