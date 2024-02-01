import { render, remove } from "../utils/render.js";
import { COMMAND, STORE_NAME, SOUNDS } from "../utils/const.js";
import { deepCopy, getClearMatrix, compareMatrix, getTime } from "../utils/utils.js";
import Store from "../api/store.js";
import Sound from "../api/sound.js";
import ControlsView from "../view/controls.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import ResultsView from "../view/results.js";
import CrosswordView from "../view/crossword.js";
import CrosswordModel from "../model/crossword.js";

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
    this.#components["results"] = new ResultsView(this.#results, this.#crossModel.getCrosswords());
  }

  render() {
    if(this.#results.length > 0) render(this.#gameContainer, this.#components['results']);
  }

  update(finishTime, currentCrossword) {
    this.#results.reverse();
    this.#results.push({time: finishTime,
    id: currentCrossword.id});
    this.#results.reverse();
    this.#results = this.#results.slice(0, 5);
    this.#store.saveResult(this.#results);
  }

  destroy() {
    remove(this.#components['results']);
  }

  #getResultFromStorage() {
    let resultsTable = this.#store.getItem('result-table');
    if (resultsTable) {
      resultsTable = resultsTable.split(',');
      resultsTable.forEach(element => {
        const result = element.split('-');
        this.#results.push({time: result[0], id: result[1]});
      });
    }
  }

}