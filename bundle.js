/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/api/sound.js":
/*!*****************************!*\
  !*** ./src/js/api/sound.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Sound)
/* harmony export */ });
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");

class Sound {
  #pathFolder = _utils_const_js__WEBPACK_IMPORTED_MODULE_0__.FOLDER_SOUND;
  #audio = new Audio();
  #soundsOnOff = true;

  soundsToggle() {
    this.#soundsOnOff = !this.#soundsOnOff;
  }

  playSound(event) {
    if (this.#soundsOnOff) {
      this.#audio.src = `${this.#pathFolder}${event}`;
      this.#audio.play();
    }
  }

  playSoundForCommand(command) {
    const event = command === _utils_const_js__WEBPACK_IMPORTED_MODULE_0__.COMMAND.CROSS ? _utils_const_js__WEBPACK_IMPORTED_MODULE_0__.SOUNDS.CROSS : _utils_const_js__WEBPACK_IMPORTED_MODULE_0__.SOUNDS.FILL;
    this.playSound(event);
  }
}


/***/ }),

/***/ "./src/js/api/store.js":
/*!*****************************!*\
  !*** ./src/js/api/store.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Store)
/* harmony export */ });
/* harmony import */ var _utils_const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/const */ "./src/js/utils/const.js");

class Store {
  #storage;
  #storeKey;

  constructor(key, storage) {
    this.#storage = storage;
    this.#storeKey = key;
  }

  saveResult(results) {
    this.#storage.setItem(
      `${this.#storeKey}-${_utils_const__WEBPACK_IMPORTED_MODULE_0__.STORE_RESULTS}`,
      JSON.stringify(results),
    );
  }

  saveGame(saveGame) {
    this.#storage.setItem(
      `${this.#storeKey}-${_utils_const__WEBPACK_IMPORTED_MODULE_0__.STORE_SAVE}`,
      JSON.stringify(saveGame),
    );
  }

  getResult() {
    return this.#getItem(_utils_const__WEBPACK_IMPORTED_MODULE_0__.STORE_RESULTS);
  }

  getSave() {
    return this.#getItem(_utils_const__WEBPACK_IMPORTED_MODULE_0__.STORE_SAVE);
  }

  #getItem(additionalKey) {
    try {
      const storedDataString = this.#storage.getItem(
        `${this.#storeKey}-${additionalKey}`,
      );
      if (storedDataString) {
        const resultsData = JSON.parse(storedDataString);
        return resultsData;
      } else return null;
    } catch (err) {
      return null;
    }
  }
}


/***/ }),

/***/ "./src/js/model/crossword.js":
/*!***********************************!*\
  !*** ./src/js/model/crossword.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Crossword)
/* harmony export */ });
class Crossword {
  #crosswords;

  constructor() {
    this.#crosswords = [];
  }

  setCrosswords(crosswords) {
    this.#crosswords = crosswords.slice();
  }

  getCrosswords() {
    return this.#crosswords;
  }

  getCrosswordById(id) {
    let index = 0;
    let currentEl = this.#crosswords[index];
    while (currentEl.id !== id) {
      index += 1;
      if (index > this.#crosswords.length - 1) break;
      currentEl = this.#crosswords[index];
    }

    return currentEl;
  }

  getNewCrossword(newCrossword, currentCrossword, isFirstStart = false) {
    if (newCrossword) return newCrossword;
    else return this.#getRandomCrossword(currentCrossword, isFirstStart);
  }

  adaptToClient(crosswords) {
    const adaptedQuestion = Object.assign({}, crosswords, {
      id: crosswords.id,
      name: crosswords.name,
      level: Number(crosswords.level),
      playTable: crosswords.playTable,
    });
    return adaptedQuestion;
  }

  #getNextCrossword() {
    return this.#crosswords[
      Math.floor(Math.random() * this.#crosswords.length)
    ];
  }

  #getRandomCrossword(current, isFirstStart) {
    let newCrossword = this.#getNextCrossword();
    while (
      current === newCrossword ||
      (isFirstStart && newCrossword.level != 1)
    ) {
      newCrossword = this.#getNextCrossword();
    }
    return newCrossword;
  }
}


/***/ }),

/***/ "./src/js/presenter/controls.js":
/*!**************************************!*\
  !*** ./src/js/presenter/controls.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Controls)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");
/* harmony import */ var _api_store_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/store.js */ "./src/js/api/store.js");
/* harmony import */ var _view_controls_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../view/controls.js */ "./src/js/view/controls.js");





class Controls {
  #gameContainer;
  #components;
  #store;
  #sound;
  #saveGameInf;
  #callback;
  #settings;

  constructor(gameContainer, sound) {
    this.#gameContainer = gameContainer;
    this.#components = {
      controls: new _view_controls_js__WEBPACK_IMPORTED_MODULE_3__["default"](),
    };

    this.#store = new _api_store_js__WEBPACK_IMPORTED_MODULE_2__["default"](_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME, window.localStorage);
    this.#sound = sound;

    this.#saveGameInf = {};
    this.#callback = {};
    this.#settings = {
      isHaveSaveGame: false,
    };

    this.#getSaveFromStorage();
  }

  setRefreshCallback(callback) {
    this.#callback.refresh = callback;
    return this;
  }
  setShowAnswersCallback(callback) {
    this.#callback.showAnswers = callback;
    return this;
  }
  setLoadCallback(callback) {
    this.#callback.load = callback;
    return this;
  }
  setSaveCallback(callback) {
    this.#callback.save = callback;
    return this;
  }
  setFindSaveCallback(callback) {
    this.#callback.findSave = callback;
    if (this.#settings.isHaveSaveGame) this.#callback.findSave();
    return this;
  }

  getTimeContainer() {
    return this.#components.controls.elements.options.wrap;
  }
  render() {
    const onRefreshClick = () => {
      this.#callback.refresh();
    };

    const onShowAnswersClick = () => {
      this.#callback.showAnswers();
    };

    const onSaveClick = () => {
      this.#saveGame();
    };
    const onLoadClick = () => {
      this.#loadGame();
    };
    const onSoundOnOff = () => {
      this.#sound.soundsToggle();
      this.#sound.playSound(_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.SOUNDS.SWITCH);
    };
    const onThemeClick = () => {
      this.#sound.playSound(_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.SOUNDS.SWITCH);
      this.#gameContainer.classList.toggle("light-theme");
      this.#gameContainer.classList.toggle("dark-theme");
    };

    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this.#gameContainer, this.#components["controls"]);

    this.#components["controls"]
      .setRefreshClickHandler(onRefreshClick)
      .setShowAnswersClickHandler(onShowAnswersClick)
      .setSaveClickHandler(onSaveClick)
      .setLoadClickHandler(onLoadClick)
      .setThemeClickHandler(onThemeClick)
      .setSoundClickHandler(onSoundOnOff);
  }

  setSaveEnabled() {
    this.#components["controls"].setSaveEnabled();
  }

  setSaveDisabled() {
    this.#components["controls"].setSaveDisabled();
  }

  #saveGame() {
    this.#settings.isHaveSaveGame = true;
    const data = this.#callback.save();
    this.#components["controls"].setLoadEnable();
    this.#saveGameInf["crossword"] = data.crossword;
    this.#saveGameInf["seconds"] = data.seconds;
    this.#saveGameInf["answers"] = data.answers;

    this.#store.saveGame(this.#saveGameInf);
  }

  #loadGame() {
    if (this.#settings.isHaveSaveGame) {
      this.#getSaveFromStorage();
      this.#callback.load(this.#saveGameInf);
    }
  }

  #getSaveFromStorage() {
    const saveGame = this.#store.getSave();

    if (saveGame) {
      this.#saveGameInf = saveGame;
      this.#settings.isHaveSaveGame = true;
      this.#components["controls"].setLoadEnable();
    }
  }
}


/***/ }),

/***/ "./src/js/presenter/crossword.js":
/*!***************************************!*\
  !*** ./src/js/presenter/crossword.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Crossword)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ "./src/js/utils/utils.js");
/* harmony import */ var _view_crossword_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view/crossword.js */ "./src/js/view/crossword.js");





class Crossword {
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
    if (answers) this.#answers = (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.deepCopy)(answers);
    else this.#answers = (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.getClearMatrix)(this.#crossword.playTable.length);
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
    this.#components["crossword"] = new _view_crossword_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.#crossword);
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

    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this.#gameContainer, this.#components["crossword"]);
    this.#components["crossword"].setCellClickHandler(onCellClick);
  }
  destroy() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this.#components["crossword"]);
  }

  loadGame() {
    this.#components["crossword"].setAnswersCrossword(this.#answers);
  }
  #setNextGameStep(index, command) {
    this.#setNewAnswer(index, command);
  }

  #setNewAnswer(index, command) {
    this.#answers[index.i][index.j] = (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.setAnswer)(command);
    if (this.#isWin()) {
      this.#callback.winGame();
    } else this.#sound.playSoundForCommand(command);
  }

  #isWin() {
    return (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.compareMatrix)(this.#answers, this.#crossword.playTable);
  }
}


/***/ }),

/***/ "./src/js/presenter/gallery.js":
/*!*************************************!*\
  !*** ./src/js/presenter/gallery.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gallery)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _view_gallery_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/gallery.js */ "./src/js/view/gallery.js");
/* harmony import */ var _model_crossword_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/crossword.js */ "./src/js/model/crossword.js");




class Gallery {
  #gameContainer;
  #components;
  #crossModel;

  constructor(gameContainer, crosswords) {
    this.#gameContainer = gameContainer;
    this.#components = {};

    this.#crossModel = new _model_crossword_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.#crossModel.setCrosswords(crosswords);
  }

  show(callback) {
    const onGameClick = (data) => {
      this.destroy();
      if (data) {
        callback(data);
      }
    };
    this.#components["gallery"] = new _view_gallery_js__WEBPACK_IMPORTED_MODULE_1__["default"](
      this.#crossModel.getCrosswords(),
    );
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this.#gameContainer, this.#components["gallery"]);
    this.#components["gallery"]
      .setCloseClickHandler(this.destroy)
      .setGameClickHandler(onGameClick);
  }

  destroy = () => {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this.#components["gallery"]);
  };
}


/***/ }),

/***/ "./src/js/presenter/nanograms.js":
/*!***************************************!*\
  !*** ./src/js/presenter/nanograms.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Nanograms)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ "./src/js/utils/utils.js");
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");
/* harmony import */ var _api_sound_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api/sound.js */ "./src/js/api/sound.js");
/* harmony import */ var _view_main_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../view/main.js */ "./src/js/view/main.js");
/* harmony import */ var _view_chose_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../view/chose.js */ "./src/js/view/chose.js");
/* harmony import */ var _model_crossword_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../model/crossword.js */ "./src/js/model/crossword.js");
/* harmony import */ var _presenter_results_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../presenter/results.js */ "./src/js/presenter/results.js");
/* harmony import */ var _presenter_timer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../presenter/timer.js */ "./src/js/presenter/timer.js");
/* harmony import */ var _presenter_crossword_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../presenter/crossword.js */ "./src/js/presenter/crossword.js");
/* harmony import */ var _presenter_controls_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../presenter/controls.js */ "./src/js/presenter/controls.js");
/* harmony import */ var _presenter_gallery_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../presenter/gallery.js */ "./src/js/presenter/gallery.js");
/* harmony import */ var _presenter_win_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../presenter/win.js */ "./src/js/presenter/win.js");














class Nanograms {
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
      main: new _view_main_js__WEBPACK_IMPORTED_MODULE_4__["default"](),
    };

    this.#crossModel = new _model_crossword_js__WEBPACK_IMPORTED_MODULE_6__["default"]();
    this.#crossModel.setCrosswords(crosswords);
    this.sound = new _api_sound_js__WEBPACK_IMPORTED_MODULE_3__["default"]();

    this.#resultsPresenter = new _presenter_results_js__WEBPACK_IMPORTED_MODULE_7__["default"](this.#crossModel);
    this.#timerPresenter = new _presenter_timer_js__WEBPACK_IMPORTED_MODULE_8__["default"]();
    this.#crosswordPresenter = new _presenter_crossword_js__WEBPACK_IMPORTED_MODULE_9__["default"](this.sound);
    this.#controlsPresenter = new _presenter_controls_js__WEBPACK_IMPORTED_MODULE_10__["default"](gameContainer, this.sound);

    this.#winPresenter = new _presenter_win_js__WEBPACK_IMPORTED_MODULE_12__["default"](gameContainer);
    this.#galleryPresenter = new _presenter_gallery_js__WEBPACK_IMPORTED_MODULE_11__["default"](gameContainer, crosswords);

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
      this.sound.playSound(_utils_const_js__WEBPACK_IMPORTED_MODULE_2__.SOUNDS.RENDER);
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
    this.sound.playSound(_utils_const_js__WEBPACK_IMPORTED_MODULE_2__.SOUNDS.REFRESH);
    this.#crosswordPresenter.setAnswers();
    this.#resetSettings();
    this.#crosswordPresenter.refresh();
  };

  onShowAnswersClick = () => {
    this.sound.playSound(_utils_const_js__WEBPACK_IMPORTED_MODULE_2__.SOUNDS.ANSWERS);
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
    this.sound.playSound(_utils_const_js__WEBPACK_IMPORTED_MODULE_2__.SOUNDS.WIN);
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
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this.#gameContainer, this.#components["main"]);
    this.#timerPresenter.setContainer(
      this.#controlsPresenter.getTimeContainer(),
    );
    this.#timerPresenter.render();
  }

  #renderGame() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(
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
    this.#components["chose"] = new _view_chose_js__WEBPACK_IMPORTED_MODULE_5__["default"](
      this.#crosswordPresenter.getCrossword(),
    );
    this.#crosswordPresenter.updateComponent();
    this.#resultsPresenter.updateComponent();
  }
  #destroyGameComponents() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this.#components["chose"]);
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


/***/ }),

/***/ "./src/js/presenter/results.js":
/*!*************************************!*\
  !*** ./src/js/presenter/results.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Results)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");
/* harmony import */ var _api_store_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/store.js */ "./src/js/api/store.js");
/* harmony import */ var _view_results_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../view/results.js */ "./src/js/view/results.js");





class Results {
  #gameContainer;
  #components;
  #crossModel;
  #store;
  #results;

  constructor(crosswords) {
    this.#crossModel = crosswords;
    this.#components = {};
    this.#store = new _api_store_js__WEBPACK_IMPORTED_MODULE_2__["default"](_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME, window.localStorage);
    this.#results = [];

    this.#getResultFromStorage();
  }

  setContainer(gameContainer) {
    this.#gameContainer = gameContainer;
  }

  updateComponent() {
    this.#components["results"] = new _view_results_js__WEBPACK_IMPORTED_MODULE_3__["default"](
      this.#results,
      this.#crossModel.getCrosswords(),
    );
  }

  render() {
    if (this.#results.length > 0)
      (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this.#gameContainer, this.#components["results"]);
  }

  update(finishTime, currentCrossword) {
    this.#results.reverse();
    this.#results.push({ time: finishTime, id: currentCrossword.id });
    this.#results.reverse();
    this.#results = this.#results.slice(0, 5);
    this.#store.saveResult(this.#results);
  }

  destroy() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this.#components["results"]);
  }

  #getResultFromStorage() {
    const storageData = this.#store.getResult(_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.STORE_RESULTS);
    if (storageData) {
      this.#results = storageData;
    }
  }
}


/***/ }),

/***/ "./src/js/presenter/timer.js":
/*!***********************************!*\
  !*** ./src/js/presenter/timer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timer)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");
/* harmony import */ var _view_timer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view/timer.js */ "./src/js/view/timer.js");




class Timer {
  #gameContainer;
  #components;
  #seconds;
  #isGameStart;
  #timer;

  constructor() {
    this.#seconds = 0;
    this.#timer = null;
    this.#isGameStart = false;
    this.#components = {
      timer: new _view_timer_js__WEBPACK_IMPORTED_MODULE_2__["default"](),
    };
  }

  startGame() {
    this.#isGameStart = true;
  }
  stopGame() {
    this.#isGameStart = false;
  }

  setContainer(gameContainer) {
    this.#gameContainer = gameContainer;
  }

  render() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(
      this.#gameContainer,
      this.#components["timer"],
      _utils_const_js__WEBPACK_IMPORTED_MODULE_1__.RENDER_METHOD.PREPEND,
    );
  }

  start() {
    if (!this.#timer) {
      this.#timer = setInterval(() => {
        if (!this.#isGameStart) this.reset();
        this.#seconds += 1;
        this.#components["timer"].updateTimerDisplay(this.#seconds);
      }, 1000);
    }
  }

  setSeconds(seconds) {
    this.#seconds = seconds;
    this.#components["timer"].updateTimerDisplay(this.#seconds);
  }
  getSeconds() {
    return this.#seconds;
  }
  reset() {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
    this.#seconds = 0;
    this.#components["timer"].updateTimerDisplay(this.#seconds);
  }
}


/***/ }),

/***/ "./src/js/presenter/win.js":
/*!*********************************!*\
  !*** ./src/js/presenter/win.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Win)
/* harmony export */ });
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _view_win_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/win.js */ "./src/js/view/win.js");



class Win {
  #gameContainer;
  #components;

  constructor(gameContainer) {
    this.#gameContainer = gameContainer;
    this.#components = {};
  }

  show(finishTime, callback) {
    this.#components["win"] = new _view_win_js__WEBPACK_IMPORTED_MODULE_1__["default"](finishTime);
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this.#gameContainer, this.#components["win"]);

    const onPlayAgainClick = () => {
      this.#destroyResultModal();
      callback();
    };

    this.#components["win"].setPlayAgainClickHandler(onPlayAgainClick);
  }

  #destroyResultModal() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this.#components["win"]);
  }
}


/***/ }),

/***/ "./src/js/utils/const.js":
/*!*******************************!*\
  !*** ./src/js/utils/const.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMMAND: () => (/* binding */ COMMAND),
/* harmony export */   FOLDER_SOUND: () => (/* binding */ FOLDER_SOUND),
/* harmony export */   RENDER_METHOD: () => (/* binding */ RENDER_METHOD),
/* harmony export */   SOUNDS: () => (/* binding */ SOUNDS),
/* harmony export */   STORE_NAME: () => (/* binding */ STORE_NAME),
/* harmony export */   STORE_RESULTS: () => (/* binding */ STORE_RESULTS),
/* harmony export */   STORE_SAVE: () => (/* binding */ STORE_SAVE)
/* harmony export */ });
const COMMAND = {
  FILL: "fill",
  EMPTY: "empty",
  CROSS: "cross",
};
const STORE_PREFIX = `nanograms`;
const STORE_VER = `v1`;
const STORE_RESULTS = `result-table`;
const STORE_SAVE = `save-game`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const RENDER_METHOD = {
  APPEND: "append",
  PREPEND: "prepend",
};

const FOLDER_SOUND = "./sound/";
const SOUNDS = {
  FILL: "click.mp3",
  CROSS: "click-context.mp3",
  RENDER: "random.mp3",
  REFRESH: "refresh.mp3",
  ANSWERS: "show-answers.mp3",
  SWITCH: "switch.mp3",
  WIN: "win.mp3",
};


/***/ }),

/***/ "./src/js/utils/render.js":
/*!********************************!*\
  !*** ./src/js/utils/render.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   remove: () => (/* binding */ remove),
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _view_abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../view/abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");



const render = (container, child, method = _utils_const_js__WEBPACK_IMPORTED_MODULE_1__.RENDER_METHOD.APPEND) => {
  const containerEl = getElement(container);
  const childEl = getElement(child);

  switch (method) {
    case _utils_const_js__WEBPACK_IMPORTED_MODULE_1__.RENDER_METHOD.APPEND: {
      containerEl.append(childEl);
      break;
    }
    case _utils_const_js__WEBPACK_IMPORTED_MODULE_1__.RENDER_METHOD.PREPEND: {
      containerEl.prepend(childEl);
      break;
    }
  }

  renderChild(childEl, getChild(child, childEl));
};

const renderChild = (container, childList) => {
  if (childList) {
    childList.forEach((childItem) => {
      if (Array.isArray(childItem.element)) {
        childItem.element.forEach((el) => render(container, el));
      } else render(container, childItem);
    });
  }
};

const getElement = (container) => {
  let element = container;
  if (element.structure) element = element.structure;
  while (element.element) {
    element = element.element;
  }
  return element;
};

const getChild = (node, element) => {
  let currentNode = node.structure ? node.structure : node.element;
  let child = node.child ? node.child : undefined;
  if (!child && currentNode) {
    while (currentNode.child) {
      if (currentNode.element === element) {
        child = currentNode.child;
        break;
      }
      currentNode = currentNode.child;
    }
  }
  return child;
};

const createElement = (properties) => {
  const newElement = Object.assign(
    document.createElement(properties.tag),
    properties,
  );

  return newElement;
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof _view_abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"])) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};


/***/ }),

/***/ "./src/js/utils/utils.js":
/*!*******************************!*\
  !*** ./src/js/utils/utils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compareMatrix: () => (/* binding */ compareMatrix),
/* harmony export */   deepCopy: () => (/* binding */ deepCopy),
/* harmony export */   getClearMatrix: () => (/* binding */ getClearMatrix),
/* harmony export */   getTime: () => (/* binding */ getTime),
/* harmony export */   setAnswer: () => (/* binding */ setAnswer)
/* harmony export */ });
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");

function deepCopy(matrix) {
  return matrix.map((row) =>
    row.map((cell) => (typeof cell === "object" ? deepCopy(cell) : cell)),
  );
}

function getClearMatrix(lengthMatrix) {
  return Array.from({ length: lengthMatrix }, () =>
    Array(lengthMatrix).fill(""),
  );
}

function compareMatrix(matrix1, matrix2) {
  const answers = matrix1.map((row) =>
    row.map((cell) => (cell === "0" ? "" : cell)),
  );
  const playTable = matrix2.map((row) =>
    row.map((cell) => (cell === "0" ? "" : cell)),
  );
  return JSON.stringify(answers) === JSON.stringify(playTable);
}

function getTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function setAnswer(command) {
  let answer;
  switch (command) {
    case _utils_const_js__WEBPACK_IMPORTED_MODULE_0__.COMMAND.FILL:
      answer = "1";
      break;
    case _utils_const_js__WEBPACK_IMPORTED_MODULE_0__.COMMAND.EMPTY:
      answer = "";
      break;
    case _utils_const_js__WEBPACK_IMPORTED_MODULE_0__.COMMAND.CROSS:
      answer = "0";
      break;
  }
  return answer;
}


/***/ }),

/***/ "./src/js/view/abstract.js":
/*!*********************************!*\
  !*** ./src/js/view/abstract.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Abstract)
/* harmony export */ });
class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }
    this.structure = null;
    this.callback = {};
  }

  getElement() {
    return this.structure["element"];
  }

  removeElement() {
    this.structure = null;
    this.elements = null;
  }
}


/***/ }),

/***/ "./src/js/view/chose.js":
/*!******************************!*\
  !*** ./src/js/view/chose.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chose)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");



class Chose extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #crossword;
  #tagsProperties;

  constructor(crossword) {
    super();
    this.#crossword = crossword;
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }

  setRandomClickHandler(callback) {
    this.callback.randomClick = callback;
    this.elements.random.a.addEventListener(`click`, this.#randomClickHandler);
    return this;
  }

  setShowGalleryClickHandler(callback) {
    this.callback.showGallery = callback;
    this.elements.chose.wrap.addEventListener(
      `click`,
      this.#showGalleryClickHandler,
    );
    return this;
  }

  #getStructure() {
    return {
      element: this.elements.choseWrap,
      child: [
        {
          element: this.elements.chose.wrap,
          child: [
            {
              element: this.elements.chose.imgWrap,
              child: [{ element: this.elements.chose.img }],
            },
            {
              element: this.elements.chose.titleWrap,
              child: [{ element: this.elements.chose.title }],
            },
            {
              element: this.elements.chose.level.wrap,
              child: Array.from(
                { length: this.#crossword.level },
                (el, i) => this.elements.chose.level[`star${i + 1}`],
              ),
            },
          ],
        },
        {
          element: this.elements.random.a,
          child: [{ element: this.elements.random.img }],
        },
      ],
    };
  }

  #getElementProperties() {
    return {
      choseWrap: {
        tag: "div",
        className: "game__chose-wrapper",
      },
      chose: {
        wrap: { tag: "div", className: "game__chose chose" },
        imgWrap: { tag: "div", className: "chose__img-wrapper" },
        img: {
          tag: "img",
          className: "chose__img",
          src: `./img/example/${this.#crossword.img}.png`,
          alt: "Chose the game",
          width: "40",
          height: "40",
        },
        titleWrap: { tag: "div", className: "chose__title-wrapper" },
        title: {
          tag: "p",
          className: "chose__title",
          textContent: `${this.#crossword.name}`,
        },
        level: {
          wrap: { tag: "div", className: "chose__level-wrapper" },
          star: {
            tag: "img",
            className: "chose__level-img",
            src: "./img/icons/level.png",
            alt: "star level",
            width: "40",
            height: "40",
          },
        },
      },
      random: {
        a: { tag: "a", className: "game__random", href: "" },
        img: {
          tag: "img",
          className: "game__random-img",
          src: "./img/icons/random.png",
          alt: "random game",
          width: "40",
          height: "40",
        },
      },
    };
  }

  #generateNode() {
    const node = {
      choseWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.choseWrap),
      chose: {
        wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.chose.wrap),
        imgWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.chose.imgWrap),
        img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.chose.img),
        titleWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.chose.titleWrap),
        title: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.chose.title),
        level: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.chose.level.wrap),
        },
      },
      random: {
        a: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.random.a),
        img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.random.img),
      },
    };

    for (let i = 1; i <= this.#crossword.level; i += 1) {
      node.chose.level[`star${i}`] = (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(
        this.#tagsProperties.chose.level.star,
      );
    }

    return node;
  }

  #randomClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.randomClick();
  };

  #showGalleryClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.showGallery();
  };
}


/***/ }),

/***/ "./src/js/view/controls.js":
/*!*********************************!*\
  !*** ./src/js/view/controls.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Controls)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");



class Controls extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #tagsProperties = this.#getElementProperties();
  elements = this.#generateNode();
  structure = this.#getStructure();

  setSaveEnabled() {
    this.elements.options.saveLoad.save.classList.remove("disable");
  }
  setSaveDisabled() {
    this.elements.options.saveLoad.save.classList.add("disable");
  }
  setLoadEnable() {
    this.elements.options.saveLoad.load.classList.remove("disable");
  }
  setRefreshClickHandler(callback) {
    this.callback.refreshClick = callback;
    this.elements.options.refresh.a.addEventListener(
      `click`,
      this.#refreshClickHandler,
    );
    return this;
  }
  setShowAnswersClickHandler(callback) {
    this.callback.showAnswers = callback;
    this.elements.options.showAnswer.a.addEventListener(
      `click`,
      this.#showAnswersClickHandler,
    );
    return this;
  }
  setSaveClickHandler(callback) {
    this.callback.saveClick = callback;
    this.elements.options.saveLoad.save.addEventListener(
      `click`,
      this.#saveClickHandler,
    );
    return this;
  }
  setLoadClickHandler(callback) {
    this.callback.loveClick = callback;
    this.elements.options.saveLoad.load.addEventListener(
      `click`,
      this.#loadClickHandler,
    );
    return this;
  }
  setThemeClickHandler(callback) {
    this.callback.themeClick = callback;
    this.elements.settings.theme.input.addEventListener(
      `click`,
      this.#themeClickHandler,
    );
    return this;
  }
  setSoundClickHandler(callback) {
    this.callback.soundClick = callback;
    this.elements.settings.sound.input.addEventListener(
      `click`,
      this.#soundClickHandler,
    );
    return this;
  }
  #getStructure() {
    return {
      element: this.elements.header,
      child: [
        { element: this.elements.h1 },
        {
          element: this.elements.options.wrap,
          child: [
            {
              element: this.elements.options.refresh.a,
              child: [{ element: this.elements.options.refresh.img }],
            },
            {
              element: this.elements.options.showAnswer.a,
              child: [{ element: this.elements.options.showAnswer.img }],
            },
            {
              element: this.elements.options.saveLoad.wrap,
              child: [
                {
                  element: this.elements.options.saveLoad.save,
                  child: [{ element: this.elements.options.saveLoad.saveImg }],
                },
                {
                  element: this.elements.options.saveLoad.load,
                  child: [{ element: this.elements.options.saveLoad.loadImg }],
                },
              ],
            },
          ],
        },
        {
          element: this.elements.settings.wrap,
          child: [
            {
              element: this.elements.settings.sound.label,
              child: [
                { element: this.elements.settings.sound.input },
                { element: this.elements.settings.sound.span },
              ],
            },
            {
              element: this.elements.settings.theme.label,
              child: [
                { element: this.elements.settings.theme.input },
                { element: this.elements.settings.theme.span },
              ],
            },
          ],
        },
      ],
    };
  }
  #getElementProperties() {
    return {
      header: { tag: "header", className: "game__control control" },
      h1: {
        tag: "h1",
        textContent: "Nanograms game",
        className: "visually-hidden",
      },
      options: {
        wrap: { tag: "div", className: "control__options options" },
        refresh: {
          a: { tag: "a", className: "options__refresh", href: "" },
          img: {
            tag: "img",
            className: "options__refresh-img",
            src: "./img/icons/refresh.png",
            alt: "refresh",
            width: "40",
            height: "40",
          },
        },
        showAnswer: {
          a: { tag: "a", className: "options__show-answer", href: "" },
          img: {
            tag: "img",
            className: "options__show-answer-img",
            src: "./img/icons/show-answers.png",
            alt: "show-answer",
            width: "40",
            height: "40",
          },
        },
        saveLoad: {
          wrap: { tag: "div", className: "options__save-load" },
          save: { tag: "a", className: "options__save disable", href: "" },
          saveImg: {
            tag: "img",
            className: "options__save-img",
            src: "./img/icons/save.png",
            alt: "save game",
            width: "40",
            height: "40",
          },
          load: { tag: "a", className: "options__load disable", href: "" },
          loadImg: {
            tag: "img",
            className: "options__load-img",
            src: "./img/icons/open.png",
            alt: "load last game",
            width: "40",
            height: "40",
          },
        },
      },
      settings: {
        wrap: { tag: "div", className: "control__settings settings" },
        sound: {
          label: {
            tag: "label",
            id: "switch-sound",
            className: "settings__sound sound",
          },
          input: {
            tag: "input",
            className: "sound__input",
            type: "checkbox",
            id: "slider-sound",
          },
          span: { tag: "span", className: "sound__slider round" },
        },
        theme: {
          label: {
            tag: "label",
            id: "switch-theme",
            className: "settings__theme theme",
          },
          input: {
            tag: "input",
            className: "theme__input",
            type: "checkbox",
            id: "slider-theme",
          },
          span: { tag: "span", className: "theme__slider round" },
        },
      },
    };
  }
  #generateNode() {
    return {
      header: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.header),
      h1: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.h1),
      options: {
        wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.wrap),
        refresh: {
          a: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.refresh.a),
          img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.refresh.img),
        },
        showAnswer: {
          a: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.showAnswer.a),
          img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.showAnswer.img),
        },
        saveLoad: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.saveLoad.wrap),
          save: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.saveLoad.save),
          saveImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.saveLoad.saveImg),
          load: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.saveLoad.load),
          loadImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.options.saveLoad.loadImg),
        },
      },
      settings: {
        wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.settings.wrap),
        sound: {
          label: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.settings.sound.label),
          input: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.settings.sound.input),
          span: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.settings.sound.span),
        },
        theme: {
          label: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.settings.theme.label),
          input: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.settings.theme.input),
          span: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.settings.theme.span),
        },
      },
    };
  }
  #refreshClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.refreshClick();
  };
  #showAnswersClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.showAnswers();
  };
  #saveClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.saveClick();
  };
  #loadClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.loveClick();
  };
  #themeClickHandler = () => {
    this.callback.themeClick();
  };
  #soundClickHandler = () => {
    this.callback.soundClick();
  };
}


/***/ }),

/***/ "./src/js/view/crossword.js":
/*!**********************************!*\
  !*** ./src/js/view/crossword.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Crossword)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");




class Crossword extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #crossword;
  #isGameStop;

  constructor(crossword) {
    super();
    this.#crossword = crossword.playTable;
    this.#isGameStop = false;
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }

  stopGame() {
    this.#isGameStop = true;
  }
  startGame() {
    this.#isGameStop = false;
  }

  loadGame(crossword, answers) {
    this.#crossword = crossword.playTable;
    this.setAnswersCrossword(answers);
  }
  setClearCrossword() {
    this.elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove("fill", "cross", "hint--off");
      });
    });
  }

  setAnswersCrossword(answer) {
    this.elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove("fill", "cross", "hint--off");
        if (
          !(
            cell.td.classList.contains("empty") ||
            cell.td.classList.contains("hint")
          )
        ) {
          const index = this.#getIndex(cell.td.data);
          switch (answer[index.i][index.j]) {
            case "1":
              cell.td.classList.add("fill");
              break;
            case "0":
              cell.td.classList.add("cross");
              break;
          }
        }
      });
    });
  }

  setCellClickHandler(callback) {
    this.callback.cellClick = callback;
    this.getElement().addEventListener(`click`, this.#cellClickHandler);
    this.getElement().addEventListener(
      `contextmenu`,
      this.#cellClickContextHandler,
    );
    return this;
  }
  #getStructure() {
    const node = {
      element: this.elements.table,
      child: [],
    };

    this.elements.rows.forEach((rowEl) => {
      const tdCells = [];
      rowEl.cells.forEach((cellEl) => {
        tdCells.push({ element: cellEl.td });
      });

      node.child.push({
        element: rowEl.tr,
        child: tdCells,
      });
    });

    return node;
  }

  #generateNode() {
    const hint = this.#generateHint(this.#crossword);

    const node = {
      table: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
        tag: "table",
        className: "game__crossword crossword",
      }),
      rows: [],
    };

    let borderCounterTopBottom = 1;
    for (let i = 0; i < hint.maxV; i += 1) {
      const borderClassTop = borderCounterTopBottom === 1 ? "border-top" : "";
      const borderClassBottom = i === hint.maxV - 1 ? "border-bottom" : "";
      node.rows.push({
        tr: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({ tag: "tr", className: `row` }),
        cells: [],
      });

      for (let j = 0; j < hint.maxH; j += 1) {
        node.rows[i].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({ tag: "td", className: "empty" }),
        });
      }

      let borderCounterLeftRight = 1;
      for (let j = 0; j < hint.vertical.length; j += 1) {
        const borderClassLeft =
          borderCounterLeftRight === 1 ? "border-left" : "";
        const borderClassRight =
          borderCounterLeftRight === 5 || j === hint.vertical.length - 1
            ? "border-right"
            : "";
        node.rows[i].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
            tag: "td",
            className: `cell hint ${borderClassTop} ${borderClassBottom} ${borderClassLeft} ${borderClassRight}`,
            textContent: hint.vertical[j][i] ? hint.vertical[j][i] : "",
          }),
        });
        borderCounterLeftRight += 1;
        if (borderCounterLeftRight === 6) borderCounterLeftRight = 1;
      }
      borderCounterTopBottom += 1;
    }

    let borderCounterRow = 1;
    for (let i = 0; i < this.#crossword.length; i += 1) {
      const borderClassTop = borderCounterRow === 1 ? "border-top" : "";
      const borderClassBottom =
        borderCounterRow === 5 || i === this.#crossword.length - 1
          ? "border-bottom"
          : "";
      node.rows.push({
        tr: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({ tag: "tr", className: "row" }),
        cells: [],
      });
      for (let j = 0; j < hint.maxH; j += 1) {
        const borderClassLeft = j === 0 ? "border-left" : "";
        const borderClassRight = j === hint.maxH - 1 ? "border-right" : "";
        node.rows[i + hint.maxV].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
            tag: "td",
            className: `cell hint ${borderClassRight} ${borderClassLeft} ${borderClassTop} ${borderClassBottom}`,
            textContent: hint.horizontal[i][j] ? hint.horizontal[i][j] : "",
          }),
        });
      }
      let borderCounterCell = 1;
      for (let j = 0; j < this.#crossword.length; j += 1) {
        const borderClassCell =
          borderCounterCell === 5 || j === this.#crossword.length - 1
            ? "border-right"
            : "";
        const borderClassRow =
          borderCounterRow === 5 || i === this.#crossword.length - 1
            ? "border-bottom"
            : "";
        node.rows[i + hint.maxV].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
            tag: "td",
            className: `cell ${borderClassCell} ${borderClassRow} ${borderClassBottom}`,
            data: `el-${i}-${j}`,
          }),
        });
        borderCounterCell += 1;
        if (borderCounterCell === 6) borderCounterCell = 1;
      }
      borderCounterRow += 1;
      if (borderCounterRow === 6) borderCounterRow = 1;
    }

    return node;
  }

  #generateHint(crossword) {
    const rows = crossword.length;
    const cols = crossword[0].length;

    const horizontal = [];
    const vertical = [];

    for (let i = 0; i < rows; i += 1) {
      let consistency = 0;
      const rowHints = [];
      for (let j = 0; j < cols; j += 1) {
        if (crossword[i][j] === "1") consistency += 1;
        if (crossword[i][j] === "0" && consistency > 0) {
          rowHints.push(consistency);
          consistency = 0;
        }
      }
      if (consistency > 0) {
        rowHints.push(consistency);
      }
      horizontal.push(rowHints);
    }

    for (let j = 0; j < cols; j += 1) {
      let consistency = 0;
      const colHints = [];

      for (let i = 0; i < rows; i += 1) {
        if (crossword[i][j] === "1") {
          consistency += 1;
        } else if (consistency > 0) {
          colHints.push(consistency);
          consistency = 0;
        }
      }

      if (consistency > 0) {
        colHints.push(consistency);
      }

      vertical.push(colHints);
    }

    const maxHorizontalLength = horizontal.reduce((max, row) => {
      return Math.max(max, row.length);
    }, 0);
    const maxVerticalLength = vertical.reduce((max, col) => {
      return Math.max(max, col.length);
    }, 0);

    const alignedHorizontalHints = horizontal.map((row) => {
      const emptyEl = Array(maxHorizontalLength - row.length).fill(0);
      return emptyEl.concat(row);
    });

    const alignedVerticalHints = vertical.map((cell) => {
      const emptyEl = Array(maxVerticalLength - cell.length).fill(0);
      return emptyEl.concat(cell);
    });

    return {
      maxH: maxHorizontalLength,
      maxV: maxVerticalLength,
      horizontal: alignedHorizontalHints,
      vertical: alignedVerticalHints,
    };
  }

  #cellClickHandler = (evt) => {
    if (this.#isGameStop) {
      return;
    }
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("hint--off"))
        evt.target.classList.remove("hint--off");
      else evt.target.classList.add("hint--off");
    } else {
      let command = "";
      if (evt.target.classList.contains("cross"))
        evt.target.classList.remove("cross");
      if (evt.target.classList.contains("fill")) {
        evt.target.classList.remove("fill");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.EMPTY;
      } else {
        evt.target.classList.add("fill");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.FILL;
      }

      const indexEl = this.#getIndex(evt.target.data);
      this.callback.cellClick(indexEl, command);
    }

    evt.preventDefault();
  };

  #cellClickContextHandler = (evt) => {
    if (this.#isGameStop) {
      return;
    }
    evt.preventDefault();
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (!evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("fill"))
        evt.target.classList.remove("fill");

      let command = "";
      if (evt.target.classList.contains("cross")) {
        evt.target.classList.remove("cross");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.EMPTY;
      } else {
        evt.target.classList.add("cross");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.CROSS;
      }

      const indexEl = this.#getIndex(evt.target.data);
      this.callback.cellClick(indexEl, command);
    }
  };

  #getIndex(data) {
    const indexArr = data.split("-");
    const index = {
      i: indexArr[1],
      j: indexArr[2],
    };
    return index;
  }
}


/***/ }),

/***/ "./src/js/view/gallery.js":
/*!********************************!*\
  !*** ./src/js/view/gallery.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gallery)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");



class Gallery extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #crosswords;
  #tagsProperties;

  constructor(crosswords) {
    super();
    this.#crosswords = crosswords;
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }

  setCloseClickHandler(callback) {
    this.callback.closeClick = callback;
    this.elements.closeBtn.addEventListener(`click`, this.#closeClickHandler);
    return this;
  }

  setGameClickHandler(callback) {
    this.callback.gameClick = callback;
    this.elements.gallery.forEach((game) => {
      game.exWrap.addEventListener(`click`, this.#gameClickHandler);
    });
    return this;
  }
  #getStructure() {
    const nodeList = [];
    this.elements.gallery.forEach((elNode) => {
      const newNode = {
        element: elNode.exWrap,
        child: [
          { element: elNode.exImg },
          { element: elNode.exName },
          {
            element: elNode.level.wrap,
            child: Array.from(
              { length: Number(elNode.level.levelNumber) },
              (el, i) => elNode.level[`star${i + 1}`],
            ),
          },
        ],
      };

      nodeList.push(newNode);
    });

    const node = {
      element: this.elements.aside,
      child: [
        {
          element: this.elements.window,
          child: [
            {
              element: this.elements.windowWrap,
              child: [
                {
                  element: this.elements.titleWrap,
                  child: [
                    { element: this.elements.title },
                    {
                      element: this.elements.closeBtn,
                      child: [{ element: this.elements.closeImg }],
                    },
                  ],
                },
                { element: this.elements.galleryWrap, child: nodeList },
              ],
            },
          ],
        },
      ],
    };

    return node;
  }
  #getElementProperties() {
    return {
      aside: { tag: "aside", className: "modal-gallery" },
      window: { tag: "div", className: "modal-gallery__window" },
      windowWrap: { tag: "div", className: "modal-gallery__wrapper" },
      titleWrap: { tag: "div", className: "modal-gallery__title-wrap" },
      title: {
        tag: "h2",
        className: "modal-gallery__title",
        textContent: `Gallery`,
      },
      closeBtn: { tag: "a", className: "modal-gallery__button" },
      closeImg: {
        tag: "img",
        className: "modal-gallery__button-img",
        src: "./img/icons/close.png",
        alt: "Close window",
        width: "40",
        height: "40",
      },
      galleryWrap: { tag: "div", className: "modal-gallery__gallery-wrap" },
      levelWrap: { tag: "div", className: "modal-gallery__level-wrapper" },
      star: {
        tag: "img",
        className: "modal-gallery__level-img",
        src: "./img/icons/level.png",
        alt: "star level",
        width: "40",
        height: "40",
      },
    };
  }
  #generateNode() {
    const node = {
      aside: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.aside),
      window: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.window),
      windowWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.windowWrap),
      titleWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.titleWrap),
      title: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.title),
      closeBtn: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.closeBtn),
      closeImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.closeImg),
      galleryWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.galleryWrap),
      gallery: [],
    };

    this.#crosswords.forEach((element) => {
      const newNode = {
        exWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
          tag: "div",
          className: "modal-gallery__example-wrap",
          data: `${element.id}`,
        }),
        exImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
          tag: "img",
          className: "modal-gallery__example-img",
          src: `./img/example/${element.img}.png`,
          alt: `${element.name}`,
          width: "40",
          height: "40",
        }),
        exName: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
          tag: "p",
          className: "modal-gallery__example-name",
          textContent: `${element.name}`,
        }),
        level: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.levelWrap),
          levelNumber: element.level,
        },
      };

      for (let i = 1; i <= element.level; i += 1) {
        newNode.level[`star${i}`] = (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.star);
      }

      node.gallery.push(newNode);
    });

    return node;
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.closeClick();
  };

  #gameClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.gameClick(evt.currentTarget.data);
  };
}


/***/ }),

/***/ "./src/js/view/main.js":
/*!*****************************!*\
  !*** ./src/js/view/main.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Main)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");



class Main extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #tagsProperties;

  constructor() {
    super();
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }
  #getStructure() {
    return {
      element: this.elements.main,
      child: [
        {
          element: this.elements.table.section,
          child: [
            { element: this.elements.table.h2 },
            { element: this.elements.table.crosswordWrap },
          ],
        },
        {
          element: this.elements.additional.section,
          child: [{ element: this.elements.additional.h2 }],
        },
      ],
    };
  }
  #getElementProperties() {
    return {
      main: {
        tag: "main",
        className: "game__wrapper",
      },
      table: {
        section: {
          tag: "section",
          className: "game__table table",
        },
        h2: {
          tag: "h2",
          className: "visually-hidden",
          textContent: "Game table",
        },
        crosswordWrap: {
          tag: "div",
          className: "game__crossword-wrapper",
        },
      },
      additional: {
        section: {
          tag: "section",
          className: "game__additional",
        },
        h2: {
          tag: "h2",
          className: "visually-hidden",
          textContent: "Additional information",
        },
      },
    };
  }
  #generateNode() {
    return {
      main: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.main),
      table: {
        section: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.table.section),
        h2: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.table.h2),
        crosswordWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.table.crosswordWrap),
      },
      additional: {
        section: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.additional.section),
        h2: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.additional.h2),
      },
    };
  }
}


/***/ }),

/***/ "./src/js/view/results.js":
/*!********************************!*\
  !*** ./src/js/view/results.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Results)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils.js */ "./src/js/utils/utils.js");
/* harmony import */ var _model_crossword_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../model/crossword.js */ "./src/js/model/crossword.js");





class Results extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #results;
  #crosswords;
  #tagsProperties;

  constructor(results, crosswords) {
    super();
    if (results) {
      this.#results = results.slice().sort(function (a, b) {
        if (a.time > b.time) {
          return 1;
        }
        if (a.time < b.time) {
          return -1;
        }
        return 0;
      });
    } else this.#results = [];

    this.#crosswords = new _model_crossword_js__WEBPACK_IMPORTED_MODULE_3__["default"]();
    this.#crosswords.setCrosswords(crosswords);
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }
  #getStructure() {
    const node = {
      element: this.elements.resultsWrap,
      child: [
        {
          element: this.elements.titleWrap,
          child: [
            { element: this.elements.img },
            { element: this.elements.titleP },
          ],
        },
      ],
    };
    this.elements.results.forEach((elNode) => {
      const newNode = {
        element: elNode.wrapInf,
        child: [
          { element: elNode.resultWrap, child: [{ element: elNode.p }] },
          {
            element: elNode.level.wrap,
            child: Array.from(
              { length: Number(elNode.level.levelNumber) },
              (el, i) => elNode.level[`star${i + 1}`],
            ),
          },
        ],
      };

      node.child.push(newNode);
    });

    return node;
  }
  #getElementProperties() {
    const node = {
      resultsWrap: { tag: "div", className: "game__results results" },
      titleWrap: { tag: "div", className: "results__title-wrapper" },
      img: {
        tag: "img",
        className: "results__img",
        src: "./img/icons/results.png",
        alt: "Results table",
        width: "40",
        height: "40",
      },
      titleP: { tag: "p", className: "results__title", textContent: "Results" },
      wrapInf: { tag: "div", className: "results__information-wrapper" },
      resultWrap: { tag: "div", className: "results__result-wrapper" },
      level: {
        wrap: { tag: "div", className: "results__level-wrapper" },
        star: {
          tag: "img",
          className: "results__level-img",
          src: "./img/icons/level.png",
          alt: "star level",
          width: "40",
          height: "40",
        },
      },
    };
    return node;
  }
  #generateNode() {
    const node = {
      resultsWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.resultsWrap),
      titleWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.titleWrap),
      img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.img),
      titleP: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.titleP),

      results: [],
    };

    this.#results.forEach((result) => {
      const cross = this.#crosswords.getCrosswordById(result.id);
      const newResultNode = {
        wrapInf: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.wrapInf),
        resultWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.resultWrap),
        p: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({
          tag: "p",
          className: "results__information",
          textContent: `${(0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.getTime)(result.time)} - ${cross.name}`,
        }),
        level: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.level.wrap),
          levelNumber: cross.level,
        },
      };

      for (let i = 1; i <= cross.level; i += 1) {
        newResultNode.level[`star${i}`] = (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(
          this.#tagsProperties.level.star,
        );
      }
      node.results.push(newResultNode);
    });
    return node;
  }
}


/***/ }),

/***/ "./src/js/view/timer.js":
/*!******************************!*\
  !*** ./src/js/view/timer.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timer)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");



class Timer extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #tagsProperties = this.#getElementProperties();
  elements = this.#generateNode();
  structure = this.#getStructure();

  updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    this.elements.time.textContent = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  #getStructure() {
    return {
      element: this.elements.wrap,
      child: [
        {
          element: this.elements.imgWrap,
          child: [{ element: this.elements.img }],
        },
        {
          element: this.elements.timeWrap,
          child: [{ element: this.elements.time }],
        },
      ],
    };
  }

  #getElementProperties() {
    return {
      wrap: { tag: "div", className: "options__timer timer" },
      imgWrap: { tag: "div", className: "timer__img-wrapper" },
      img: {
        tag: "img",
        className: "timer__img",
        src: "./img/icons/timer.png",
        alt: "timer",
        width: "40",
        height: "40",
      },
      timeWrap: { tag: "div", className: "timer__time-wrapper" },
      time: { tag: "p", className: "timer__time", textContent: "0:00" },
    };
  }

  #generateNode() {
    return {
      wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.wrap),
      imgWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.imgWrap),
      img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.img),
      timeWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.timeWrap),
      time: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.time),
    };
  }
}


/***/ }),

/***/ "./src/js/view/win.js":
/*!****************************!*\
  !*** ./src/js/view/win.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EndWin)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");



class EndWin extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #time;
  #tagsProperties;

  constructor(time) {
    super();
    this.#time = time;
    this.#tagsProperties = this.#getElementProperties();
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }
  setPlayAgainClickHandler(callback) {
    this.callback.playAgainClick = callback;
    this.elements.closeBtn.addEventListener(
      `click`,
      this.#playAgainClickHandler,
    );
  }
  #getStructure() {
    return {
      element: this.elements.aside,
      child: [
        {
          element: this.elements.window,
          child: [
            {
              element: this.elements.div,
              child: [
                {
                  element: this.elements.titleWrap,
                  child: [
                    { element: this.elements.img },
                    { element: this.elements.title },
                  ],
                },
                { element: this.elements.information },
                {
                  element: this.elements.closeBtn,
                  child: [{ element: this.elements.closeImg }],
                },
              ],
            },
          ],
        },
      ],
    };
  }
  #getElementProperties() {
    return {
      aside: { tag: "aside", className: "modal-results" },
      window: { tag: "div", className: "modal-results__window" },
      div: { tag: "div", className: "modal-results__wrapper" },
      titleWrap: { tag: "div", className: "modal-results__title-wrap" },
      title: {
        tag: "h2",
        className: "modal-results__title",
        textContent: `Great! `,
      },
      img: {
        tag: "img",
        className: "modal-results__img",
        src: "./img/icons/results.png",
        alt: `Winner's medal`,
        width: "40",
        height: "40",
      },
      information: {
        tag: "p",
        className: "modal-results__information",
        textContent: `You have solved the nanograms in ${this.#time} seconds!`,
      },
      closeBtn: { tag: "a", className: "modal-results__button" },
      closeImg: {
        tag: "img",
        className: "modal-results__button-img",
        src: "./img/icons/win.png",
        alt: "Close window",
        width: "40",
        height: "40",
      },
    };
  }
  #generateNode() {
    return {
      aside: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.aside),
      window: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.window),
      div: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.div),
      titleWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.titleWrap),
      title: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.title),
      img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.img),
      information: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.information),
      closeBtn: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.closeBtn),
      closeImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this.#tagsProperties.closeImg),
    };
  }

  #playAgainClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.playAgainClick();
  };
}


/***/ }),

/***/ "./src/mock/mock.json":
/*!****************************!*\
  !*** ./src/mock/mock.json ***!
  \****************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"id":"1.1","name":"Badminton","level":"1","img":"badminton","playTable":[["0","0","0","1","1"],["0","1","1","1","1"],["1","1","1","1","0"],["0","1","1","1","0"],["0","0","1","0","0"]]},{"id":"1.2","name":"Hamburger","level":"1","img":"hamburger","playTable":[["0","1","1","1","0"],["1","1","0","0","1"],["1","1","1","1","1"],["1","1","0","0","1"],["0","1","1","1","0"]]},{"id":"1.3","name":"Cup","level":"1","img":"cup","playTable":[["1","1","1","1","1"],["1","0","0","0","1"],["1","0","0","0","1"],["0","1","0","1","0"],["1","1","1","1","1"]]},{"id":"1.4","name":"Skull","level":"1","img":"skull","playTable":[["0","1","1","1","0"],["1","1","1","1","1"],["1","0","1","0","1"],["1","1","1","1","1"],["0","1","1","1","0"]]},{"id":"1.5","name":"Yoda","level":"1","img":"yoda","playTable":[["0","0","1","0","0"],["1","1","1","1","1"],["0","1","0","1","0"],["1","0","0","0","1"],["0","1","1","1","0"]]},{"id":"2.1","name":"Cheburashka","level":"2","img":"cheburashka","playTable":[["0","1","1","1","0","0","1","1","1","0"],["1","0","0","0","1","1","0","0","0","1"],["1","0","0","0","0","0","0","0","0","1"],["1","0","0","1","0","0","1","0","0","1"],["1","1","0","0","1","1","0","0","1","1"],["0","0","1","0","0","0","0","1","0","0"],["0","1","1","0","0","0","0","1","1","0"],["0","1","1","1","0","0","1","1","1","0"],["0","0","1","1","1","1","1","1","0","0"],["0","1","1","1","0","0","1","1","1","0"]]},{"id":"2.2","name":"Penguin","level":"2","img":"penguin","playTable":[["0","0","0","0","1","1","0","0","0","0"],["0","0","0","1","1","1","1","0","0","0"],["0","0","1","0","1","1","0","1","0","0"],["0","0","1","1","0","0","1","1","0","0"],["0","1","0","0","0","0","0","0","1","0"],["0","1","0","0","0","0","0","0","1","0"],["1","1","0","0","0","0","0","0","1","1"],["0","1","1","0","0","0","0","1","1","0"],["0","0","1","1","0","0","1","1","0","0"],["0","1","1","1","1","1","1","1","1","0"]]},{"id":"2.3","name":"Butterfly","level":"2","img":"butterfly","playTable":[["0","0","0","1","0","0","1","0","0","0"],["0","0","0","0","1","1","0","0","0","0"],["1","1","1","0","0","0","0","1","1","1"],["1","0","0","1","0","0","1","0","0","1"],["1","1","1","0","1","1","0","1","1","1"],["0","0","1","1","1","1","1","1","0","0"],["1","1","1","0","1","1","0","1","1","1"],["1","0","1","1","1","1","1","1","0","1"],["1","1","0","0","1","1","0","0","1","1"],["0","0","1","1","0","0","1","1","0","0"]]},{"id":"2.4","name":"Camera","level":"2","img":"camera","playTable":[["0","0","1","0","1","1","0","0","0","0"],["0","1","1","1","1","1","1","1","0","0"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","0","0","0","0","1","1","1"],["1","1","1","0","0","0","0","1","1","1"],["1","1","1","0","0","0","0","1","1","1"],["1","1","1","0","0","0","0","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"]]},{"id":"2.5","name":"Dolphin","level":"2","img":"dolphin","playTable":[["0","1","1","1","1","1","1","1","1","0"],["0","0","1","1","1","1","1","1","1","1"],["0","1","1","1","1","1","1","0","0","0"],["1","1","1","1","1","1","0","0","0","0"],["0","1","1","1","1","0","0","0","0","0"],["0","0","1","1","0","0","0","0","0","0"],["0","0","1","1","0","0","0","0","0","0"],["0","0","0","1","1","1","0","0","0","0"],["0","0","0","1","1","0","0","0","0","0"],["0","0","0","1","0","0","0","0","0","0"]]},{"id":"3.1","name":"Calibre","img":"calibre","level":"3","playTable":[["0","0","0","0","0","1","0","0","0","0","0","0","0","0","0"],["1","1","1","0","0","0","1","0","0","0","0","0","0","0","0"],["1","0","1","1","0","0","1","0","0","0","0","0","0","0","0"],["1","0","0","1","1","0","1","1","0","0","0","0","0","0","0"],["1","0","0","0","1","1","1","1","0","1","1","1","1","1","1"],["1","1","0","0","0","1","1","1","1","1","1","1","0","0","0"],["0","1","1","0","0","0","0","1","1","1","1","0","0","0","0"],["0","0","1","1","0","0","1","1","0","1","0","0","0","0","0"],["0","0","0","1","1","0","1","0","0","1","0","0","0","0","0"],["0","0","0","0","1","1","0","1","1","0","0","0","0","0","0"],["0","0","0","1","0","0","1","1","0","0","0","0","0","0","0"],["0","0","1","0","0","1","0","0","0","0","0","0","0","0","0"],["0","0","1","0","0","1","0","0","0","0","0","0","0","0","0"],["0","1","0","0","1","0","0","0","0","0","0","0","0","0","0"],["0","1","1","1","0","0","0","0","0","0","0","0","0","0","0"]]},{"id":"3.2","name":"Unicorn","level":"3","img":"unicorn","playTable":[["0","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],["0","0","0","0","0","0","0","0","0","0","0","0","0","1","0"],["0","0","0","0","0","0","0","1","0","0","0","0","1","1","0"],["0","0","0","0","0","0","1","1","1","1","1","1","1","0","0"],["0","0","0","0","1","1","1","0","0","1","1","1","1","0","0"],["0","0","0","0","1","1","1","0","0","0","0","1","0","0","0"],["0","0","0","1","1","0","1","0","0","0","0","1","0","0","0"],["0","0","1","1","1","0","0","0","0","1","0","1","0","0","0"],["0","0","1","1","1","0","0","0","0","0","0","0","1","0","0"],["0","1","1","0","0","0","0","1","1","1","0","0","1","1","0"],["1","1","1","0","0","0","0","1","0","0","1","1","1","1","0"],["0","0","0","1","0","0","0","1","0","0","0","1","1","0","0"],["0","0","0","0","1","1","0","1","0","0","0","0","0","0","0"],["0","0","0","0","0","0","1","1","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","1","0","0","0","0","0","0","0"]]},{"id":"3.3","name":"Footprint","img":"footprint","level":"3","playTable":[["0","0","0","0","1","1","0","0","0","1","1","0","0","0","0"],["0","0","0","1","1","1","1","0","1","1","1","1","0","0","0"],["0","0","1","1","1","1","1","0","1","1","1","1","1","0","0"],["0","0","1","1","1","1","1","0","1","1","1","1","1","0","0"],["0","0","0","1","1","1","0","0","0","1","1","1","0","0","0"],["1","1","0","0","1","0","0","0","0","0","1","0","0","1","1"],["1","1","1","0","0","0","0","1","0","0","0","0","1","1","1"],["1","1","1","1","0","0","1","1","1","0","0","1","1","1","1"],["1","1","1","1","0","1","1","1","1","1","0","1","1","1","1"],["1","1","0","0","1","1","1","1","1","1","1","0","0","1","1"],["0","0","0","1","1","1","1","1","1","1","1","1","0","0","0"],["0","0","1","1","1","1","1","1","1","1","1","1","1","0","0"],["0","0","1","1","1","1","1","1","1","1","1","1","1","0","0"],["0","0","0","1","1","1","1","1","1","1","1","1","0","0","0"],["0","0","0","0","1","1","1","1","1","1","1","0","0","0","0"]]},{"id":"3.4","name":"Octopus","img":"octopus","level":"3","playTable":[["0","0","0","0","0","0","0","1","0","0","0","0","0","0","0"],["0","0","0","0","0","0","1","1","1","0","0","0","0","0","0"],["0","0","0","0","0","1","1","1","1","1","0","0","0","0","0"],["0","0","0","0","0","1","1","1","1","1","0","0","0","0","0"],["0","0","0","1","1","1","0","1","0","1","1","1","0","0","0"],["1","1","0","0","1","0","1","1","1","0","1","0","0","1","1"],["1","0","1","0","1","0","1","1","1","0","1","0","1","0","1"],["0","0","1","1","1","1","1","1","1","1","1","1","1","0","0"],["0","0","0","1","0","1","1","1","1","1","0","1","0","0","0"],["0","1","1","0","1","1","1","0","1","1","1","0","1","1","0"],["0","1","0","1","1","0","1","0","1","0","1","1","0","1","0"],["0","0","0","1","0","0","1","0","1","0","0","1","0","0","0"],["0","0","0","0","0","0","1","0","1","0","0","0","0","0","0"],["0","0","0","0","1","0","1","0","1","0","1","0","0","0","0"],["0","0","0","0","0","1","1","0","1","1","0","0","0","0","0"]]},{"id":"3.5","name":"Bull","img":"bull","level":"3","playTable":[["1","0","0","0","0","0","0","0","0","0","0","0","0","0","1"],["1","1","0","0","0","0","0","0","0","0","0","0","0","1","1"],["1","0","1","0","0","0","1","1","1","0","0","0","1","0","1"],["1","1","0","1","0","1","1","1","1","1","0","1","0","1","1"],["0","1","1","1","1","1","1","1","1","1","1","1","1","1","0"],["0","1","1","1","1","1","1","1","1","1","1","1","1","1","0"],["1","1","1","0","1","1","1","1","1","1","1","0","1","1","1"],["1","0","1","1","0","1","1","1","1","1","0","1","1","0","1"],["0","0","0","1","1","1","1","1","1","1","1","1","0","0","0"],["0","0","0","1","1","1","1","1","1","1","1","1","0","0","0"],["0","0","0","1","1","1","1","1","1","1","1","1","0","0","0"],["0","0","0","0","1","1","1","1","1","1","1","0","0","0","0"],["0","0","0","0","1","1","0","0","0","1","1","0","0","0","0"],["0","0","0","0","1","1","1","0","1","1","1","0","0","0","0"],["0","0","0","0","1","1","1","1","1","1","1","0","0","0","0"]]}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scss/main.scss */ "./src/scss/main.scss");
/* harmony import */ var _mock_mock_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mock/mock.json */ "./src/mock/mock.json");
/* harmony import */ var _js_model_crossword_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/model/crossword.js */ "./src/js/model/crossword.js");
/* harmony import */ var _js_presenter_nanograms_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/presenter/nanograms.js */ "./src/js/presenter/nanograms.js");





const siteBodyElement = document.body;

if (siteBodyElement !== null) {
  const crosswordModel = new _js_model_crossword_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
  const crosswords = _mock_mock_json__WEBPACK_IMPORTED_MODULE_1__.map(crosswordModel.adaptToClient);
  crosswordModel.setCrosswords(crosswords);

  const nanogramsPresenter = new _js_presenter_nanograms_js__WEBPACK_IMPORTED_MODULE_3__["default"](
    siteBodyElement,
    crosswordModel.getCrosswords(),
  );

  const props = { isReset: true, isFirstStart: true };
  nanogramsPresenter.startGame(props);
}

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map