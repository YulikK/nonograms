import { render, remove } from "../utils/render.js";
import {
  deepCopy,
  getClearMatrix,
  compareMatrix,
  setAnswer,
} from "../utils/utils.js";

import CrosswordView from "../view/crossword.js";

export default class Crossword {
  #gameContainer;
  #components;
  #callback;
  #crossword;
  #answers;
  #sound;
  #settings;

  constructor(sound) {
    this.#components = {};
    this.#callback = {};
    this.#answers = [];
    this.#sound = sound;

    this.#settings = {
      isGameStarted: false,
      isShowAnswers: false,
    };
  }

  setContainer(gameContainer) {
    this.#gameContainer = gameContainer;
  }
  setCrossword(newCrossword) {
    this.#crossword = newCrossword;
  }
  getCrossword() {
    return this.#crossword;
  }
  setAnswers(answers = undefined) {
    if (answers) this.#answers = deepCopy(answers);
    else this.#answers = getClearMatrix(this.#crossword.playTable.length);
  }
  getAnswers() {
    return this.#answers;
  }
  startGame() {
    this.#settings.isGameStarted = true;
  }
  stopGame() {
    this.#settings.isGameStarted = false;
  }
  show() {
    this.#settings.isShowAnswers = true;
  }
  hide() {
    this.#settings.isShowAnswers = false;
  }
  setStartGameCallback(callback) {
    this.#callback.startGame = callback;
    return this;
  }
  setWinCallback(callback) {
    this.#callback.winGame = callback;
    return this;
  }
  updateComponent() {
    this.#components["crossword"] = new CrosswordView(this.#crossword);
  }
  refresh() {
    this.#components["crossword"].setClearCrossword();
    this.#components["crossword"].startGame();
  }
  showAnswers() {
    this.setAnswers(this.#crossword.playTable);
    this.#components["crossword"].setAnswersCrossword(
      this.#crossword.playTable,
    );
    this.#components["crossword"].stopGame();
  }
  render() {
    const onCellClick = (index, command) => {
      if (!this.#settings.isShowAnswers) {
        if (!this.#settings.isGameStarted) {
          this.#settings.isGameStarted = true;
          this.#callback.startGame();
        }
        this.#setNextGameStep(index, command);
      }
    };

    render(this.#gameContainer, this.#components["crossword"]);
    this.#components["crossword"].setCellClickHandler(onCellClick);
  }
  destroy() {
    remove(this.#components["crossword"]);
  }

  loadGame() {
    this.#components["crossword"].setAnswersCrossword(this.#answers);
  }
  #setNextGameStep(index, command) {
    this.#setNewAnswer(index, command);
  }

  #setNewAnswer(index, command) {
    this.#answers[index.i][index.j] = setAnswer(command);
    if (this.#isWin()) {
      this.#callback.winGame();
    } else this.#sound.playSoundForCommand(command);
  }

  #isWin() {
    return compareMatrix(this.#answers, this.#crossword.playTable);
  }
}
