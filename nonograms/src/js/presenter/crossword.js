import { render, remove } from "../utils/render.js";
import { COMMAND, STORE_NAME, SOUNDS } from "../utils/const.js";
import { deepCopy, getClearMatrix, compareMatrix, getTime } from "../utils/utils.js";
import Store from "../api/store.js";
import Sound from "../api/sound.js";
import ControlsView from "../view/controls.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import CrosswordView from "../view/crossword.js";
import CrosswordModel from "../model/crossword.js";
import ResultsPresenter from "../presenter/results.js";
import TimerPresenter from "../presenter/timer.js";

export default class Crossword {
  #gameContainer;
  #gallery;
  #win;
  #components;
  #callback;
  #crossword; 
  #currentCrossword;
  #answers;
  #store;
  #sound;
  #resultsPresenter;
  #timerPresenter;
  #saveGameInf;
  #settings;

  constructor(gameContainer, crossword) {
    
    this.#components = {};
    this.#callback = {};
    this.#crossword = crossword;
    this.#answers = [];
    this.#sound = new Sound();

    this.#settings = {
      isGameStarted: false,
      isShowAnswers: false,
    }
  }

  setContainer(gameContainer){
    this.#gameContainer = gameContainer;
  }
  setCrossword(newCrossword) {
    this.#crossword = newCrossword;
  }
  getCrossword() {
    return this.#crossword;
  }
  setAnswers(answers = undefined) {
    if (answers)  this.#answers = deepCopy(answers);
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
  showAnswers() {
    this.#settings.isShowAnswers = true;
  }
  hideAnswers() {
    this.#settings.isShowAnswers = false;
  }
  setStartGameCallback(callback) {
    this.#callback.startGame = callback;
  }
  setWinCallback(callback) {
    this.#callback.winGame = callback;
  }
  updateComponent() {
    this.#components["crossword"] = new CrosswordView(this.#crossword);
  }
  refresh() {
    this.#components["crossword"].setClearCrossword();
    this.#components["crossword"].startGame();
  }
  showAnswers(){
    this.setAnswers(this.#crossword.playTable);
    this.#components["crossword"].setAnswersCrossword(this.#crossword.playTable);
    this.#components["crossword"].stopGame();
  }
  

  render() {
    const onCellClick = (index, command) => {
      if(!this.#settings.isShowAnswers) {
        if(!this.#settings.isGameStarted) {
          this.#settings.isGameStarted = true;
          this.#callback.startGame();
          // this.#components["controls"].setSaveEnabled();
          // this.#timerPresenter.startGame();
          // this.#timerPresenter.start();
        }
        this.#setNextGameStep(index, command);
      }
    };

    // const onRandomClick = () => {
    //   this.startGame(undefined, true);
    // };

    // const onShowGalleryClick = () => {
    //   this.#showGallery();
    // }

    // render(this.#components['main'].elements.additional.section, this.#components['chose']);
    // this.#resultsPresenter.setContainer(this.#components['main'].elements.additional.section);
    // this.#resultsPresenter.render();
    render(this.#gameContainer, this.#components['crossword']);
    this.#components['crossword'].setCellClickHandler(onCellClick);
    // this.#components['chose'].setRandomClickHandler(onRandomClick);
    // this.#components['chose'].setShowGalleryClickHandler(onShowGalleryClick);
  }

  #setNextGameStep(index, command) {
    this.#setNewAnswer(index, command);
  }

  #setNewAnswer(index, command) {
    switch(command){
      case COMMAND.FILL:
        this.#answers[index.i][index.j] = '1';
        break;
      case COMMAND.EMPTY:
        this.#answers[index.i][index.j] = '';
        break;
      case COMMAND.CROSS:
        this.#answers[index.i][index.j] = '0';
        break;
    }

    if (this.#isWin()) {
      this.#callback.winGame();
    } else this.#sound.playSound(command === COMMAND.CROSS ? SOUNDS.CROSS : SOUNDS.FILL);
  }

  #isWin() {
    return compareMatrix(this.#answers, this.#crossword.playTable);
  }

  // #showGallery() {
  //   const callback = (data) => {
  //     if (data) {
  //       this.startGame(this.#crossModel.getElementById(data), true);
  //     }
  //   };
  //   this.#gallery.show(callback);
  // }

  // #showWinModal() {
  //   const finishTime = this.#timerPresenter.getTime();
  //   this.#resetSettings();
  //   this.#resultsPresenter.update(finishTime, this.#currentCrossword);

  //   const onPlayAgainClick = () => {
  //     this.startGame(undefined, true);
  //   };

  //   this.#win.show(finishTime, onPlayAgainClick);
    
  // }

  destroy() {
    remove(this.#components['crossword']);
    // remove(this.#components['chose']);
    // this.#resultsPresenter.destroy();
  }

  // #saveGame() {
  //   this.#settings.isHaveSaveGame = true;
  //   this.#components['controls'].setLoadEnable();
  //   this.#saveGameInf['crossword'] = this.#currentCrossword;
  //   this.#saveGameInf['seconds'] = this.#timerPresenter.getSeconds();
  //   this.#saveGameInf['answers'] = this.#answers;

  //   this.#store.saveGame(this.#saveGameInf);
  // }

  loadGame(){
    this.#components["crossword"].setAnswersCrossword(this.#answers);
  }

  // #getSaveFromStorage() {

  //   let saveGame = this.#store.getItem('save-game');

  //   if (saveGame) {
  //     saveGame = saveGame.split(':');
  //     if (saveGame.length) {
  //       try{
  //         this.#settings.isHaveSaveGame = true;
  //         this.#saveGameInf['crossword'] = this.#crossModel.getElementById(saveGame[0]);
  //         this.#saveGameInf['seconds'] = saveGame[1];
  //         const answers = saveGame[2].split('-');
  //         this.#saveGameInf['answers'] = answers.map(row => row.split(','));
  //         this.#components['controls'].setLoadEnable();
  //       } catch (e) {
  //         console.log("We have some problems with your save game");
  //       }
        
  //     }
      
  //   }
  // }
}