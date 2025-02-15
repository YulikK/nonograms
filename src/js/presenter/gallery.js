import { render, remove } from "../utils/render.js";
import GalleryView from "../view/gallery.js";
import CrosswordModel from "../model/crossword.js";

export default class Gallery {
  #gameContainer;
  #components;
  #crossModel;

  constructor(gameContainer, crosswords) {
    this.#gameContainer = gameContainer;
    this.#components = {};

    this.#crossModel = new CrosswordModel();
    this.#crossModel.setCrosswords(crosswords);
  }

  show(callback) {
    const onGameClick = (data) => {
      this.destroy();
      if (data) {
        callback(data);
      }
    };
    this.#components["gallery"] = new GalleryView(
      this.#crossModel.getCrosswords(),
    );
    render(this.#gameContainer, this.#components["gallery"]);
    this.#components["gallery"]
      .setCloseClickHandler(this.destroy)
      .setGameClickHandler(onGameClick);
  }

  destroy = () => {
    remove(this.#components["gallery"]);
  };
}
