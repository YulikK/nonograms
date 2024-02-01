import { render, remove } from "../utils/render.js";
import { SOUNDS } from "../utils/const.js";
import Sound from "../api/sound.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import CrosswordModel from "../model/crossword.js";
import ResultsPresenter from "../presenter/results.js";
import TimerPresenter from "../presenter/timer.js";
import CrosswordPresenter from "../presenter/crossword.js";
import ControlsPresenter from "../presenter/controls.js";

export default class Nanograms {
  #gameContainer;
  #gallery;
  #win;
  #components;
  #crossModel;
  sound;
  #resultsPresenter;
  #timerPresenter;
  #crosswordPresenter;
  #controlsPresenter;
  #settings;

  constructor(gameContainer, crosswords, gallery, win) {
    this.#gameContainer = gameContainer;
    this.#gallery = gallery;
    this.#win = win;
    this.#components = {
      main: new MainView(),
    }
    
    this.#crossModel = new CrosswordModel();
    this.#crossModel.setCrosswords(crosswords);
    this.sound = new Sound();

    this.#resultsPresenter = new ResultsPresenter(this.#crossModel);
    this.#timerPresenter = new TimerPresenter();
    this.#crosswordPresenter = new CrosswordPresenter(this.sound);
    this.#controlsPresenter = new ControlsPresenter(gameContainer, this.sound);

    this.#settings = {
      isHaveSaveGame: false,
      isGameStarted: false,
      isShowAnswers: false,
    }
  }

  startGame(newCrossword = undefined, isReset = true, isFirstStart = false, answers = undefined) {
    if (isReset) this.#resetSettings();
    if (isFirstStart) this.#renderBase();
    if (!isFirstStart) this.#destroyGameComponents();
    if (!isFirstStart) this.sound.playSound(SOUNDS.RENDER);
    this.#crosswordPresenter.setCrossword(this.#crossModel.getNewCrossword(newCrossword, this.#crosswordPresenter.getCrossword()))
    this.#crosswordPresenter.setAnswers(answers);
    this.#updateGameComponents();
    this.#renderGame();
  }

  #resetSettings(){
    this.#timerPresenter.reset();
    this.#settings.isGameStarted = false;
    this.#settings.isShowAnswers = false;
    this.#timerPresenter.stopGame();
    this.#crosswordPresenter.stopGame();
    this.#crosswordPresenter.hideAnswers();
  }

  #updateGameComponents() {
    this.#components["chose"] = new ChoseView(this.#crosswordPresenter.getCrossword());
    this.#crosswordPresenter.updateComponent();
    this.#resultsPresenter.updateComponent();
  }

  onRefreshClick = () => {
    this.sound.playSound(SOUNDS.REFRESH);
    this.#crosswordPresenter.setAnswers();
    this.#resetSettings();
    this.#crosswordPresenter.refresh();
  };

  onShowAnswersClick = () => {
    this.sound.playSound(SOUNDS.ANSWERS);
    this.#crosswordPresenter.showAnswers();
    this.#resetSettings();
    this.#settings.isShowAnswers = true;
    this.#crosswordPresenter.showAnswers();
  };

  onFindSave = () => {
    this.#settings.isHaveSaveGame = true;
  }

  onLoadClick = (saveGame) => {
    this.#loadGame(saveGame);
  };

  onSaveClick = () => {
    this.#settings.isHaveSaveGame = true;
    return {
      crossword: this.#crosswordPresenter.getCrossword(),
      seconds: this.#timerPresenter.getSeconds(),
      answers: this.#crosswordPresenter.getAnswers()
    }
  };

  #renderBase() {
    this.#controlsPresenter.render();
    this.#controlsPresenter.setRefreshCallback(this.onRefreshClick);
    this.#controlsPresenter.setShowAnswersCallback(this.onShowAnswersClick);
    this.#controlsPresenter.setLoadCallback(this.onLoadClick);
    this.#controlsPresenter.setSaveCallback(this.onSaveClick);
    this.#controlsPresenter.setFindSaveCallback(this.onFindSave);
    render(this.#gameContainer, this.#components['main']);
    this.#timerPresenter.setContainer(this.#controlsPresenter.getTimeContainer());
    this.#timerPresenter.render();
  }

  onCellClick = () =>  {
    if(!this.#settings.isShowAnswers) {
      if(!this.#settings.isGameStarted) {
        this.#settings.isGameStarted = true;
        this.#controlsPresenter.setSaveEnabled();
        this.#timerPresenter.startGame();
        this.#timerPresenter.start();
      }
    }
  };

  #renderGame() {
    const onRandomClick = () => {
      this.startGame(undefined, true);
    };

    const onShowGalleryClick = () => {
      this.#showGallery();
    }

    render(this.#components['main'].elements.additional.section, this.#components['chose']);
    this.#resultsPresenter.setContainer(this.#components['main'].elements.additional.section);
    this.#resultsPresenter.render();
    this.#crosswordPresenter.setContainer(this.#components['main'].elements.table.crosswordWrap);
    this.#crosswordPresenter.render();
    this.#crosswordPresenter.setStartGameCallback(this.onCellClick);
    this.#crosswordPresenter.setWinCallback(this.showWinModal);
    this.#components['chose'].setRandomClickHandler(onRandomClick);
    this.#components['chose'].setShowGalleryClickHandler(onShowGalleryClick);
  }

  #showGallery() {
    const callback = (data) => {
      if (data) {
        this.startGame(this.#crossModel.getElementById(data), true);
      }
    };
    this.#gallery.show(callback);
  }

  showWinModal = () => {
    this.sound.playSound(SOUNDS.WIN);
    const finishTime = this.#timerPresenter.getTime();
    this.#resetSettings();
    this.#resultsPresenter.update(finishTime, this.#crosswordPresenter.getCrossword());

    const onPlayAgainClick = () => {
      this.startGame(undefined, true);
    };

    this.#win.show(finishTime, onPlayAgainClick);
  }

  #destroyGameComponents() {
    remove(this.#components['chose']);
    this.#crosswordPresenter.destroy();
    this.#resultsPresenter.destroy();
  }

  #loadGame(saveGame){
    if (this.#settings.isHaveSaveGame) {
      this.startGame(this.#crossModel.getElementById(saveGame['crossword']), true, false, saveGame['answers']);
      this.#timerPresenter.setSeconds(Number(saveGame['seconds']));
      this.#crosswordPresenter.loadGame();
    }
  }
}