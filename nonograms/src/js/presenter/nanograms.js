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

export default class Nanograms {
  #gameContainer;
  #gallery;
  #win;
  #components;
  #crossModel;
  #currentCrossword;
  #answers;
  #store;
  #sound;
  #resultsPresenter;
  #timerPresenter;
  #saveGameInf;
  #settings;

  constructor(gameContainer, crosswords, gallery, win) {
    this.#gameContainer = gameContainer;
    this.#gallery = gallery;
    this.#win = win;
    this.#components = {
      controls: new ControlsView(),
      main: new MainView(),
    }
    
    this.#crossModel = new CrosswordModel();
    this.#crossModel.setCrosswords(crosswords);

    this.#resultsPresenter = new ResultsPresenter(this.#crossModel);
    this.#timerPresenter = new TimerPresenter();

    this.#store = new Store(STORE_NAME, window.localStorage);
    this.#sound = new Sound();

    this.#saveGameInf = {};

    this.#settings = {
      isHaveSaveGame: false,
      isGameStarted: false,
      isShowAnswers: false,
    }

    this.#getSaveFromStorage();
  }

  startGame(newCrossword = undefined, isReset = true, isFirstStart = false, answers = undefined) {
    if (isReset) this.#resetSettings();
    if (isFirstStart) this.#renderBase();
    if (!isFirstStart) this.#destroyGameComponents();
    if (!isFirstStart) this.#sound.playSound(SOUNDS.RENDER);
    this.#currentCrossword = this.#crossModel.getNewCrossword(newCrossword, this.#currentCrossword);
    this.#setAnswers(answers);
    this.#updateGameComponents();
    this.#renderGame();
  }

  #resetSettings(){
    this.#timerPresenter.reset();
    this.#settings.isGameStarted = false;
    this.#settings.isShowAnswers = false;
    this.#timerPresenter.stopGame();
  }
  
  #setAnswers(answers = undefined) {
    if (answers)  this.#answers = deepCopy(answers);
    else this.#answers = getClearMatrix(this.#currentCrossword.playTable.length);
  }

  #updateGameComponents() {
    this.#components["chose"] = new ChoseView(this.#currentCrossword);
    this.#components["crossword"] = new CrosswordView(this.#currentCrossword);
    this.#resultsPresenter.updateComponent();
  }

  #renderBase() {
    const onRefreshClick = () => {
      this.#sound.playSound(SOUNDS.REFRESH);
      this.#setAnswers();
      this.#resetSettings();
      this.#components["crossword"].setClearCrossword();
      this.#components["crossword"].startGame();
    };

    const onShowAnswersClick = () => {
      this.#sound.playSound(SOUNDS.ANSWERS);
      this.#setAnswers(this.#currentCrossword.playTable);
      this.#components["crossword"].setAnswersCrossword(this.#currentCrossword.playTable);
      this.#components["crossword"].stopGame();
      this.#resetSettings();
      this.#settings.isShowAnswers = true;

    };

    const onSaveClick = () => {
      this.#saveGame();
    };
    const onLoadClick = () => {
      this.#loadGame();
    };
    const onSoundOnOff = () => {
      this.#sound.soundsToggle();
      this.#sound.playSound(SOUNDS.SWITCH);
    };
    const onThemeClick = () => {
      this.#sound.playSound(SOUNDS.SWITCH);
      this.#gameContainer.classList.toggle('light-theme');
      this.#gameContainer.classList.toggle('dark-theme');
    };

    render(this.#gameContainer, this.#components['controls']);
    render(this.#gameContainer, this.#components['main']);
    this.#timerPresenter.setContainer(this.#components.controls.elements.options.wrap);
    this.#timerPresenter.render();

    this.#components['controls'].setRefreshClickHandler(onRefreshClick);
    this.#components['controls'].setShowAnswersClickHandler(onShowAnswersClick);
    this.#components['controls'].setSaveClickHandler(onSaveClick);
    this.#components['controls'].setLoadClickHandler(onLoadClick);
    this.#components['controls'].setThemeClickHandler(onThemeClick);
    this.#components['controls'].setSoundClickHandler(onSoundOnOff);
  }

  #renderGame() {
    const onCellClick = (index, command) => {
      if(!this.#settings.isShowAnswers) {
        if(!this.#settings.isGameStarted) {
          this.#settings.isGameStarted = true;
          this.#components["controls"].setSaveEnabled();
          this.#timerPresenter.startGame();
          this.#timerPresenter.start();
        }
        this.#setNextGameStep(index, command);
      }
    };

    const onRandomClick = () => {
      this.startGame(undefined, true);
    };

    const onShowGalleryClick = () => {
      this.#showGallery();
    }

    render(this.#components['main'].elements.additional.section, this.#components['chose']);
    this.#resultsPresenter.setContainer(this.#components['main'].elements.additional.section);
    this.#resultsPresenter.render();
    render(this.#components['main'].elements.table.crosswordWrap, this.#components['crossword']);
    this.#components['crossword'].setCellClickHandler(onCellClick);
    this.#components['chose'].setRandomClickHandler(onRandomClick);
    this.#components['chose'].setShowGalleryClickHandler(onShowGalleryClick);
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
      this.#sound.playSound(SOUNDS.WIN);
      this.#showWinModal();
    } else this.#sound.playSound(command === COMMAND.CROSS ? SOUNDS.CROSS : SOUNDS.FILL);
  }

  #isWin() {
    return compareMatrix(this.#answers, this.#currentCrossword.playTable);
  }

  #showGallery() {
    const callback = (data) => {
      if (data) {
        this.startGame(this.#crossModel.getElementById(data), true);
      }
    };
    this.#gallery.show(callback);
  }

  #showWinModal() {
    const finishTime = this.#timerPresenter.getTime();
    this.#resetSettings();
    this.#resultsPresenter.update(finishTime, this.#currentCrossword);

    const onPlayAgainClick = () => {
      this.startGame(undefined, true);
    };

    this.#win.show(finishTime, onPlayAgainClick);
    
  }

  #destroyGameComponents() {
    remove(this.#components['crossword']);
    remove(this.#components['chose']);
    this.#resultsPresenter.destroy();
  }

  #saveGame() {
    this.#settings.isHaveSaveGame = true;
    this.#components['controls'].setLoadEnable();
    this.#saveGameInf['crossword'] = this.#currentCrossword;
    this.#saveGameInf['seconds'] = this.#timerPresenter.getSeconds();
    this.#saveGameInf['answers'] = this.#answers;

    this.#store.saveGame(this.#saveGameInf);
  }

  #loadGame(){
    if (this.#settings.isHaveSaveGame) {
      this.#getSaveFromStorage();

      this.startGame(this.#saveGameInf['crossword'], true, false, this.#saveGameInf['answers']);
      
      this.#timerPresenter.setSeconds(Number(this.#saveGameInf['seconds']));
      this.#components["crossword"].setAnswersCrossword(this.#answers);
    }
  }

  #getSaveFromStorage() {

    let saveGame = this.#store.getItem('save-game');

    if (saveGame) {
      saveGame = saveGame.split(':');
      if (saveGame.length) {
        try{
          this.#settings.isHaveSaveGame = true;
          this.#saveGameInf['crossword'] = this.#crossModel.getElementById(saveGame[0]);
          this.#saveGameInf['seconds'] = saveGame[1];
          const answers = saveGame[2].split('-');
          this.#saveGameInf['answers'] = answers.map(row => row.split(','));
          this.#components['controls'].setLoadEnable();
        } catch (e) {
          console.log("We have some problems with your save game");
        }
        
      }
      
    }
  }
}