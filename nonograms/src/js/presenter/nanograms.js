import { render, remove } from "../utils/render.js";
import { STORE_NAME, SOUNDS } from "../utils/const.js";
import Store from "../api/store.js";
import Sound from "../api/sound.js";
import ControlsView from "../view/controls.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import CrosswordModel from "../model/crossword.js";
import ResultsPresenter from "../presenter/results.js";
import TimerPresenter from "../presenter/timer.js";
import CrosswordPresenter from "../presenter/crossword.js";

export default class Nanograms {
  #gameContainer;
  #gallery;
  #win;
  #components;
  #crossModel;
  #store;
  #sound;
  #resultsPresenter;
  #timerPresenter;
  #crosswordPresenter;
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
    this.#crosswordPresenter = new CrosswordPresenter();
    

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

  #renderBase() {
    const onRefreshClick = () => {
      this.#sound.playSound(SOUNDS.REFRESH);
      this.#crosswordPresenter.setAnswers();
      this.#resetSettings();
      this.#crosswordPresenter.refresh();
    };

    const onShowAnswersClick = () => {
      this.#sound.playSound(SOUNDS.ANSWERS);
      this.#crosswordPresenter.showAnswers();
      this.#resetSettings();
      this.#settings.isShowAnswers = true;
      this.#crosswordPresenter.showAnswers();
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

  onCellClick = () =>  {
    if(!this.#settings.isShowAnswers) {
      if(!this.#settings.isGameStarted) {
        this.#settings.isGameStarted = true;
        this.#components["controls"].setSaveEnabled();
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
    this.#sound.playSound(SOUNDS.WIN);
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

  #saveGame() {
    this.#settings.isHaveSaveGame = true;
    this.#components['controls'].setLoadEnable();
    this.#saveGameInf['crossword'] = this.#crosswordPresenter.getCrossword();
    this.#saveGameInf['seconds'] = this.#timerPresenter.getSeconds();
    this.#saveGameInf['answers'] = this.#crosswordPresenter.getAnswers();

    this.#store.saveGame(this.#saveGameInf);
  }

  #loadGame(){
    if (this.#settings.isHaveSaveGame) {
      this.#getSaveFromStorage();
      this.startGame(this.#saveGameInf['crossword'], true, false, this.#saveGameInf['answers']);
      this.#timerPresenter.setSeconds(Number(this.#saveGameInf['seconds']));
      this.#crosswordPresenter.loadGame();
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