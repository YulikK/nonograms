import { render, remove } from "../utils/render.js";
import { getTime } from "../utils/utils.js";
import { SOUNDS } from "../utils/const.js";
import Sound from "../api/sound.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import CrosswordModel from "../model/crossword.js";
import ResultsPresenter from "../presenter/results.js";
import TimerPresenter from "../presenter/timer.js";
import CrosswordPresenter from "../presenter/crossword.js";
import ControlsPresenter from "../presenter/controls.js";
import GalleryPresenter from "../presenter/gallery.js";
import WinPresenter from "../presenter/win.js";

export default class Nanograms {
  #gameContainer;
  #galleryPresenter;
  #winPresenter;
  #components;
  #crossModel;
  #resultsPresenter;
  #timerPresenter;
  #crosswordPresenter;
  #controlsPresenter;
  #settings;
  sound;

  constructor(gameContainer, crosswords) {
    this.#gameContainer = gameContainer;

    this.#components = {
      main: new MainView(),
    };

    this.#crossModel = new CrosswordModel();
    this.#crossModel.setCrosswords(crosswords);
    this.sound = new Sound();

    this.#resultsPresenter = new ResultsPresenter(this.#crossModel);
    this.#timerPresenter = new TimerPresenter();
    this.#crosswordPresenter = new CrosswordPresenter(this.sound);
    this.#controlsPresenter = new ControlsPresenter(gameContainer, this.sound);

    this.#winPresenter = new WinPresenter(gameContainer);
    this.#galleryPresenter = new GalleryPresenter(gameContainer, crosswords);

    this.#settings = {
      isHaveSaveGame: false,
      isGameStarted: false,
      isShowAnswers: false,
    };
  }

  startGame(props = {}) {
    const {
      newCrossword = undefined,
      isReset = true,
      isFirstStart = false,
      answers = undefined,
    } = props;
    if (isReset) this.#resetSettings();
    if (isFirstStart) this.#renderBase();
    else {
      this.#destroyGameComponents();
      this.sound.playSound(SOUNDS.RENDER);
    }
    this.#crosswordPresenter.setCrossword(
      this.#crossModel.getNewCrossword(
        newCrossword,
        this.#crosswordPresenter.getCrossword(),
        isFirstStart,
      ),
    );
    this.#crosswordPresenter.setAnswers(answers);
    this.#updateGameComponents();
    this.#renderGame();
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
    this.#crosswordPresenter.show();
  };

  onFindSave = () => {
    this.#settings.isHaveSaveGame = true;
  };

  onLoadClick = (saveGame) => {
    this.#loadGame(saveGame);
  };

  onSaveClick = () => {
    this.#settings.isHaveSaveGame = true;
    return {
      crossword: this.#crosswordPresenter.getCrossword(),
      seconds: this.#timerPresenter.getSeconds(),
      answers: this.#crosswordPresenter.getAnswers(),
    };
  };

  onCellClick = () => {
    if (!this.#settings.isShowAnswers) {
      if (!this.#settings.isGameStarted) {
        this.#settings.isGameStarted = true;
        this.#controlsPresenter.setSaveEnabled();
        this.#timerPresenter.startGame();
        this.#timerPresenter.start();
      }
    }
  };

  onRandomClick = () => {
    const props = { isReset: true };
    this.startGame(props);
  };

  onShowGalleryClick = () => {
    this.#showGallery();
  };

  showWinModal = () => {
    this.sound.playSound(SOUNDS.WIN);
    const finishSeconds = this.#timerPresenter.getSeconds();
    this.#resetSettings();
    this.#resultsPresenter.update(
      finishSeconds,
      this.#crosswordPresenter.getCrossword(),
    );

    const onPlayAgainClick = () => {
      const props = { isReset: true };
      this.startGame(props);
    };

    this.#winPresenter.show(finishSeconds, onPlayAgainClick);
  };

  #renderBase() {
    this.#controlsPresenter.render();
    this.#controlsPresenter
      .setRefreshCallback(this.onRefreshClick)
      .setShowAnswersCallback(this.onShowAnswersClick)
      .setLoadCallback(this.onLoadClick)
      .setSaveCallback(this.onSaveClick)
      .setFindSaveCallback(this.onFindSave);
    render(this.#gameContainer, this.#components["main"]);
    this.#timerPresenter.setContainer(
      this.#controlsPresenter.getTimeContainer(),
    );
    this.#timerPresenter.render();
  }

  #renderGame() {
    render(
      this.#components["main"].elements.additional.section,
      this.#components["chose"],
    );
    this.#resultsPresenter.setContainer(
      this.#components["main"].elements.additional.section,
    );
    this.#resultsPresenter.render();
    this.#crosswordPresenter.setContainer(
      this.#components["main"].elements.table.crosswordWrap,
    );
    this.#crosswordPresenter.render();
    this.#crosswordPresenter
      .setStartGameCallback(this.onCellClick)
      .setWinCallback(this.showWinModal);
    this.#components["chose"]
      .setRandomClickHandler(this.onRandomClick)
      .setShowGalleryClickHandler(this.onShowGalleryClick);
  }

  #showGallery() {
    const callback = (data) => {
      if (data) {
        const props = {
          newCrossword: this.#crossModel.getCrosswordById(data),
          isReset: true,
        };
        this.startGame(props);
      }
    };
    this.#galleryPresenter.show(callback);
  }
  #resetSettings() {
    this.#timerPresenter.reset();
    this.#settings.isGameStarted = false;
    this.#settings.isShowAnswers = false;
    this.#controlsPresenter.setSaveDisabled();
    this.#timerPresenter.stopGame();
    this.#crosswordPresenter.stopGame();
    this.#crosswordPresenter.hide();
  }
  #updateGameComponents() {
    this.#components["chose"] = new ChoseView(
      this.#crosswordPresenter.getCrossword(),
    );
    this.#crosswordPresenter.updateComponent();
    this.#resultsPresenter.updateComponent();
  }
  #destroyGameComponents() {
    remove(this.#components["chose"]);
    this.#crosswordPresenter.destroy();
    this.#resultsPresenter.destroy();
  }

  #loadGame(saveGame) {
    if (this.#settings.isHaveSaveGame) {
      const props = {
        newCrossword: saveGame["crossword"],
        isReset: true,
        answers: saveGame["answers"],
      };
      this.startGame(props);
      this.#timerPresenter.setSeconds(Number(saveGame["seconds"]));
      this.#crosswordPresenter.loadGame();
    }
  }
}
