import { render, remove } from "../utils/render.js";
import { STORE_NAME } from "../utils/const.js";
import Store from "../api/store.js";
import ResultsView from "../view/results.js";

export default class Results {
  #gameContainer;
  #components;
  #crossModel;
  #store;
  #results;

  constructor(crosswords) {
    this.#crossModel = crosswords;
    this.#components = {};
    this.#store = new Store(STORE_NAME, window.localStorage);
    this.#results = [];

    this.#getResultFromStorage();
  }

  setContainer(gameContainer) {
    this.#gameContainer = gameContainer;
  }

  updateComponent() {
    this.#components["results"] = new ResultsView(
      this.#results,
      this.#crossModel.getCrosswords(),
    );
  }

  render() {
    if (this.#results.length > 0)
      render(this.#gameContainer, this.#components["results"]);
  }

  update(finishTime, currentCrossword) {
    this.#results.reverse();
    this.#results.push({ time: finishTime, id: currentCrossword.id });
    this.#results.reverse();
    this.#results = this.#results.slice(0, 5);
    this.#store.saveResult(this.#results);
  }

  destroy() {
    remove(this.#components["results"]);
  }

  #getResultFromStorage() {
    let resultsTable = this.#store.getItem("result-table");
    if (resultsTable) {
      resultsTable = resultsTable.split(",");
      resultsTable.forEach((element) => {
        const result = element.split("-");
        this.#results.push({ time: result[0], id: result[1] });
      });
    }
  }
}
