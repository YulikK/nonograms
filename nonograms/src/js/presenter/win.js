import { render, remove } from "../utils/render.js";
import winView from "../view/win.js";

export default class Win {
  #gameContainer;
  #components;

  constructor(gameContainer) {
    this.#gameContainer = gameContainer;
    this.#components = {};
  }

  show(finishTime, callback) {
    this.#components["win"] = new winView(finishTime);
    render(this.#gameContainer, this.#components["win"]);

    const onPlayAgainClick = () => {
      this.#destroyResultModal();
      callback();
    };

    this.#components['win'].setPlayAgainClickHandler(onPlayAgainClick);
  }

  #destroyResultModal() {
    remove(this.#components['win']);
  }

}