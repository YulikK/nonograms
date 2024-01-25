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
  constructor() {
    this._crosswords = [];
  }

  setCrosswords(crosswords) {
    this._crosswords = crosswords.slice();
  }

  getCrosswords() {
    return this._crosswords;
  }

  getElementById(id) {
    let index = 0;
    let currentEl = this._crosswords[index];
    while( currentEl.id !== id ) {
      index += 1;
      if(index > this._crosswords.length - 1) break
      currentEl = this._crosswords[index];
    }

    return currentEl;
  }

  getRandomCrossword(current) {
    let newCrossword = this._getNextCrossword();
    while (current === newCrossword) {
      newCrossword = this._getNextCrossword();
    }
    return newCrossword;
  }

  _getNextCrossword() {
    return this._crosswords[Math.floor(Math.random() * this._crosswords.length)];
  }

  adaptToClient(crosswords) {
    const adaptedQuestion = Object.assign({}, crosswords, {
      id: crosswords.id,
      name: crosswords.name,
      level: Number(crosswords.level),
      playTable: crosswords.playTable
    });
    return adaptedQuestion;
  }
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
/* harmony import */ var _utils_const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/const.js */ "./src/js/utils/const.js");
/* harmony import */ var _view_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view/controls.js */ "./src/js/view/controls.js");
/* harmony import */ var _view_main_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../view/main.js */ "./src/js/view/main.js");
/* harmony import */ var _view_chose_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../view/chose.js */ "./src/js/view/chose.js");
/* harmony import */ var _view_results_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../view/results.js */ "./src/js/view/results.js");
/* harmony import */ var _view_crossword_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../view/crossword.js */ "./src/js/view/crossword.js");
/* harmony import */ var _view_end_game_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../view/end-game.js */ "./src/js/view/end-game.js");
/* harmony import */ var _view_gallery_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../view/gallery.js */ "./src/js/view/gallery.js");
/* harmony import */ var _model_crossword_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../model/crossword.js */ "./src/js/model/crossword.js");











class Nanograms {
  constructor(gameContainer) {
    this._gameContainer = gameContainer;
    this._controlsComponent = new _view_controls_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this._mainComponent = new _view_main_js__WEBPACK_IMPORTED_MODULE_3__["default"]();
    
  }

  init(crosswords) {
    this._crossModel = new _model_crossword_js__WEBPACK_IMPORTED_MODULE_9__["default"]();
    this._crossModel.setCrosswords(crosswords);
    this._results = [];
    this._isHaveSaveGame = false;
    this._saveGame = {};
    this._getResultFromStorage();
    this._seInitSettings();
    this._renderBase();
    this._getRandomCrossword();
    this._setAnswers();
    this._startNewGame();
    
  }

  _seInitSettings(){
    this._timer = undefined;
    this._seconds = 0;
    this._isGameStarted = false;
    this._isShowAnswers = false;
    
  }

  _getRandomCrossword() {
    this._currentCrossword = this._crossModel.getRandomCrossword();
  }

  _deepCopy(matrix) {
    return matrix.map(row => row.map(cell => typeof cell === 'object' ? deepCopy(cell) : cell));
  }
  
  _setAnswers(answers = undefined) {
    if (answers)  this._answers = this._deepCopy(answers);
    else this._answers = this._clearAnswers();
  }

  _startNewGame() {
    
    this._choseComponent = new _view_chose_js__WEBPACK_IMPORTED_MODULE_4__["default"](this._currentCrossword);
    this._crosswordComponent = new _view_crossword_js__WEBPACK_IMPORTED_MODULE_6__["default"](this._currentCrossword);
    this._resultsComponent = new _view_results_js__WEBPACK_IMPORTED_MODULE_5__["default"](this._results, this._crossModel.getCrosswords());
    this._renderGame();
  }

  _renderBase() {
    const onRefreshClick = () => {
      this._answers = this._clearAnswers();
      this._crosswordComponent.setClearCrossword();
      this._isGameStarted = false;
      this._isShowAnswers = false;
      this._crosswordComponent.startGame();
      this._resetTimer();
    };

    const onShowAnswersClick = () => {
      this._answers = this._clearAnswers();
      this._crosswordComponent.setAnswersCrossword(this._currentCrossword.playTable);
      this._isGameStarted = false;
      this._isShowAnswers = true;
      this._crosswordComponent.stopGame();
      this._resetTimer();
    };

    const onSaveClick = () => {
      this._saveGameToStorage();
    };
    const onLoadClick = () => {
      this._loadGame();
    };

    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this._gameContainer, this._controlsComponent);
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this._gameContainer, this._mainComponent);

    this._controlsComponent.setRefreshClickHandler(onRefreshClick);
    this._controlsComponent.setShowAnswersClickHandler(onShowAnswersClick);
    this._controlsComponent.setSaveClickHandler(onSaveClick);
    this._controlsComponent.setLoadClickHandler(onLoadClick);

    this._getSaveFromStorage();
  }

  _renderGame() {
    const onCellClick = (index, command) => {
      if(!this._isShowAnswers) {
        if(!this._isGameStarted) {
          this._setGameStartSettings();
        }
        this._setNextGameStep(index, command);
      }
    };

    const onRandomClick = () => {
      this._resetTimer();
      this._seInitSettings();
      this._restartGame();
    };

    const onShowGalleryClick = () => {
      this._showGallery();
    }

    ;(0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this._mainComponent._elements.additional.section, this._choseComponent);
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this._mainComponent._elements.additional.section, this._resultsComponent);
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this._mainComponent._elements.table.crosswordWrap, this._crosswordComponent);
    this._crosswordComponent.setCellClickHandler(onCellClick);
    this._choseComponent.setRandomClickHandler(onRandomClick);
    this._choseComponent.setShowGalleryClickHandler(onShowGalleryClick);
  }

  _setGameStartSettings() {
    this._isGameStarted = true;
    this._controlsComponent.setSaveEnabled();
    this._startTimer();
  }

  _setNextGameStep(index, command) {
    
      this._setNewAnswer(index, command);
      const audio = new Audio('./muz/click.mp3');
      audio.play();
  }

  _setNewAnswer(index, command) {
    
    switch(command){
      case _utils_const_js__WEBPACK_IMPORTED_MODULE_1__.COMMAND.FILL:
        this._answers[index.i][index.j] = '1';
        break;
      case _utils_const_js__WEBPACK_IMPORTED_MODULE_1__.COMMAND.EMPTY:
        this._answers[index.i][index.j] = '';
        break;
      case _utils_const_js__WEBPACK_IMPORTED_MODULE_1__.COMMAND.CROSS:
        this._answers[index.i][index.j] = '0';
        break;
    }

    if (this._isFinish()) this._showEndGameInformation();
  }


  _clearAnswers() {
    return Array.from({ length: this._currentCrossword.playTable.length }, () => Array(this._currentCrossword.playTable.length).fill(''));
  }
  
  _loadGame(){
    if (this._isHaveSaveGame) {
      this._destroyGameResult();
      this._currentCrossword = this._saveGame['crossword'];
      this._resetTimer();
      this._isGameStarted = false;
      this._isShowAnswers = false;
      this._seconds = Number(this._saveGame['seconds']);
      this._controlsComponent.updateTimerDisplay(this._seconds);
      this._setAnswers(this._saveGame['answers']);
      this._startNewGame();
      this._crosswordComponent.setAnswersCrossword(this._answers);
    }
  }


  _startTimer() {
    if (!this._timer) {
      this._timer = setInterval(() => {
        if(!this._isGameStarted) this._resetTimer();
        this._seconds += 1;
        this._controlsComponent.updateTimerDisplay(this._seconds);
      }, 1000);
    }
  }

  _resetTimer() {
    
      clearInterval(this._timer);
      this._timer = null;
      this._seconds = 0;
      this._controlsComponent.updateTimerDisplay(this._seconds);

    
  }

  _isFinish() {
    const answers = this._answers.map(row => row.map(cell => cell === '0' ? '' : cell));
    const playTable = this._currentCrossword.playTable.map(row => row.map(cell => cell === '0' ? '' : cell));
    return JSON.stringify(answers) === JSON.stringify(playTable);
  }

  _getTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  _showGallery() {
    const onCloseClick = () => {
      this._destroyGalleryModal();
      // this._restartGame();
    };
    const onGameClick = (data) => {
      this._destroyGalleryModal();
      if (data) {
        this._destroyGameResult();
        this._currentCrossword = this._crossModel.getElementById(data);
        this._setAnswers();
        this._startNewGame();
      }
    };
    this._galleryComponent = new _view_gallery_js__WEBPACK_IMPORTED_MODULE_8__["default"](this._crossModel.getCrosswords());
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this._gameContainer, this._galleryComponent);
    this._galleryComponent.setCloseClickHandler(onCloseClick);
    this._galleryComponent.setGameClickHandler(onGameClick);
  }

  _showEndGameInformation() {
    const finishTime = this._getTime(this._seconds);
    this._isGameStarted = false;
    this._resetTimer();

    
    this._results.reverse();
    this._results.push({time: finishTime,
    id: this._currentCrossword.id});
    this._results.reverse();
    this._results = this._results.slice(0, 5);
    this._setResultToStorage();
    

    this._endGameComponent = new _view_end_game_js__WEBPACK_IMPORTED_MODULE_7__["default"](finishTime);

    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.render)(this._gameContainer, this._endGameComponent);

    const onPlayAgainClick = () => {
      this._destroyResultModal();
      this._restartGame();
    };

    this._endGameComponent.setPlayAgainClickHandler(onPlayAgainClick);
  }

  _restartGame() {
    this._destroyGameResult();
    this._getRandomCrossword();
    this._setAnswers();
    this._startNewGame();
  }

  _destroyGalleryModal() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this._galleryComponent);
  }

  _destroyResultModal() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this._endGameComponent);
  }

  _destroyGameResult() {
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this._crosswordComponent);
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this._choseComponent);
    (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_0__.remove)(this._resultsComponent);
  }

  _setResultToStorage() {
    window.localStorage.setItem(
      `${_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME}-result-table`,
      this._results.map(el => `${el.time}-${el.id}`),
    );
  }

  _saveGameToStorage() {
    const id = this._currentCrossword.id;
    const answers = this._answers.join('-');

    this._isHaveSaveGame = true;
    this._controlsComponent.setLoadEnable();
    this._saveGame['crossword'] = this._currentCrossword;
    this._saveGame['seconds'] = this._seconds;
    this._saveGame['answers'] = this._answers;

    window.localStorage.setItem(
      `${_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME}-save-game`, `${id}:${this._seconds}:${answers}`);
  }

  _getResultFromStorage() {
    let resultsTable = window.localStorage.getItem(
      `${_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME}-result-table`,
    );
    if (resultsTable) {
      resultsTable = resultsTable.split(',');
      resultsTable.forEach(element => {
        const result = element.split('-');
        this._results.push({time: result[0], id: result[1]});
      });
    }
  }

  _getSaveFromStorage() {

    let saveGame = window.localStorage.getItem(
      `${_utils_const_js__WEBPACK_IMPORTED_MODULE_1__.STORE_NAME}-save-game`,
    );

    if (saveGame) {
      saveGame = saveGame.split(':');
      if (saveGame.length) {
        try{
          this._isHaveSaveGame = true;
          this._saveGame['crossword'] = this._crossModel.getElementById(saveGame[0]);
          this._saveGame['seconds'] = saveGame[1];
          const answers = saveGame[2].split('-');
          this._saveGame['answers'] = answers.map(row => row.split(','));
          this._controlsComponent.setLoadEnable();
        } catch (e) {
          console.log("We have some problems with your save game");
        }
        
      }
      
    }
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
/* harmony export */   STORE_NAME: () => (/* binding */ STORE_NAME)
/* harmony export */ });
const COMMAND = {
  FILL: 'fill',
  EMPTY: 'empty',
  CROSS: 'cross'
};
const STORE_PREFIX = `hangman`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

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


const render = (container, child) => {
  const containerEl = getElement(container);
  const childEl = getElement(child);

  containerEl.append(childEl);

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
  if (element._structure) element = element._structure;
  while (element.element) {
    element = element.element;
  }
  return element;
};

const getChild = (node, element) => {
  let currentNode = node._structure ? node._structure : node.element;
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
    this._structure = null;
    this._callback = {};
  }

  getElement() {
    return this._structure["element"];
  }

  removeElement() {
    this.element = null;
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
  constructor(crossword) {
    super();
    this._crossword = crossword
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._randomClickHandler = this._randomClickHandler.bind(this);
    this._showGalleryClickHandler = this._showGalleryClickHandler.bind(this);
  }
  getStructure() {
    return {
      element: this._elements.choseWrap,
      child: [
        {element: this._elements.chose.wrap,
        child: [
          {element: this._elements.chose.imgWrap,
            child: [{element: this._elements.chose.img}]},
          {element: this._elements.chose.titleWrap,
            child: [{element: this._elements.chose.title}]},
          {element: this._elements.chose.level.wrap,
            child: Array.from({ length: this._crossword.level }, (el, i) => this._elements.chose.level[`star${i + 1}`])},
        ]},
        {element: this._elements.random.a,
          child: [{element: this._elements.random.img}]}
        ]};
  }

  getElementProperties() {
    return {
      choseWrap: {
        tag: 'div',
        className: 'game__chose-wrapper'
      },
      chose: {
        wrap: {tag: 'div', className: 'game__chose chose'},
        imgWrap: {tag: 'div', className: 'chose__img-wrapper'},
        img: {tag: 'img', className: 'chose__img', src: `./img/example/${this._crossword.img}.png`, alt: 'Chose the game', width: '40', height: '40'},
        titleWrap: {tag: 'div', className: 'chose__title-wrapper'},
        title: {tag: 'p', className: 'chose__title', textContent: `${this._crossword.name}`},
        level: {
          wrap: {tag: 'div', className: 'chose__level-wrapper'},
          star: {tag: 'img', className: 'chose__level-img', src: './img/icons/level.png', alt: 'star level', width: '40', height: '40'}
        }
      },
      random: {
        a: {tag: 'a', className: 'game__random', href: ''},
        img: {tag: 'img', className: 'game__random-img', src: './img/icons/random.png', alt: 'random game', width: '40', height: '40'},
      }
    };
  }

  generateNode() {
    const node = {
      choseWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.choseWrap),
      chose: {
        wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.chose.wrap),
        imgWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.chose.imgWrap),
        img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.chose.img),
        titleWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.chose.titleWrap),
        title: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.chose.title),
        level: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.chose.level.wrap),
        }
      },
      random: {
        a: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.random.a),
        img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.random.img),
      }
    };
  
    for(let i = 1; i <= this._crossword.level; i+=1) {
      node.chose.level[`star${i}`] = (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.chose.level.star);
    }

    return node;
  }
  _randomClickHandler(evt) {
    evt.preventDefault();
    this._callback.randomClick();
  }

  _showGalleryClickHandler(evt) {
    evt.preventDefault();
    this._callback.showGallery();
  }

  setRandomClickHandler(callback) {
    this._callback.randomClick = callback;
    this._elements.random.a.addEventListener(`click`, this._randomClickHandler);
  }

  setShowGalleryClickHandler(callback) {
    this._callback.showGallery = callback;
    this._elements.chose.wrap.addEventListener(`click`, this._showGalleryClickHandler);
  }
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
  constructor() {
    super();
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._refreshClickHandler = this._refreshClickHandler.bind(this);
    this._showAnswersClickHandler = this._showAnswersClickHandler.bind(this);
    this._saveClickHandler = this._saveClickHandler.bind(this);
    this._loadClickHandler = this._loadClickHandler.bind(this);
  }
  getStructure() {
    return {
      element: this._elements.header,
      child: [
        {element: this._elements.h1},
        {element: this._elements.options.wrap,
        child:[
          {element: this._elements.options.timer.wrap,
          child: [
            {element: this._elements.options.timer.imgWrap,
            child: [
              {element: this._elements.options.timer.img}
            ]},
            {element: this._elements.options.timer.timeWrap,
            child: [
              {element: this._elements.options.timer.time}
            ]}
          ]},
          {element: this._elements.options.refresh.a,
          child: [
            {element: this._elements.options.refresh.img}
          ]},
          {element: this._elements.options.showAnswer.a,
          child: [
            {element: this._elements.options.showAnswer.img}
          ]},
          {element: this._elements.options.saveLoad.wrap,
            child: [
              {element: this._elements.options.saveLoad.save,
                child: [{ element:this._elements.options.saveLoad.saveImg}]},
              {element: this._elements.options.saveLoad.load,
                child: [{element: this._elements.options.saveLoad.loadImg}]}
              ]}
        ]},
        {element: this._elements.settings.wrap,
        child: [
          {element: this._elements.settings.sound.a,
          child: [
            {element: this._elements.settings.sound.img}
          ]},
          {element: this._elements.settings.theme.label,
          child: [
            {element: this._elements.settings.theme.input},
            {element: this._elements.settings.theme.span},
          ]}
        ]},
      ],
    };
  }
  getElementProperties() {
    return {
      header: { tag: 'header', className: 'game__control control' },
      h1: { tag: 'h1', textContent: 'Nanograms game', className: 'visually-hidden' },
      options: {
        wrap: { tag: 'div', className: 'control__options options' },
        timer: {
          wrap: { tag: 'div', className: 'options__timer timer' },
          imgWrap: { tag: 'div', className: 'timer__img-wrapper' },
          img: { tag: 'img', className: 'timer__img', src: './img/icons/timer.png', alt: 'timer', width: '40', height: '40' },
          timeWrap: { tag: 'div', className: 'timer__time-wrapper' },
          time: { tag: 'p', className: 'timer__time', textContent: '0:00' }
        },
        refresh: {
          a: { tag: 'a', className: 'options__refresh', href: '' },
          img: { tag: 'img', className: 'options__refresh-img', src: './img/icons/refresh.png', alt: 'refresh', width: '40', height: '40' }
        },
        showAnswer: {
          a: { tag: 'a', className: 'options__show-answer', href: '' },
          img: { tag: 'img', className: 'options__show-answer-img', src: './img/icons/show-answers.png', alt: 'show-answer', width: '40', height: '40' }
        },
        saveLoad: {
          wrap: { tag: 'div', className: 'options__save-load' },
          save: { tag: 'a', className: 'options__save disable', href: ''},
          saveImg: { tag: 'img', className: 'options__save-img', src: './img/icons/save.png', alt: 'save game', width: '40', height: '40' },
          load: { tag: 'a', className: 'options__load disable', href: ''},
          loadImg: { tag: 'img', className: 'options__load-img', src: './img/icons/open.png', alt: 'load last game', width: '40', height: '40' },
        },
      },
      settings: {
        wrap: { tag: 'div', className: 'control__settings settings' },
        sound: {
          a: { tag: 'a', className: 'settings__sound', href: '' },
          img: { tag: 'img', className: 'settings__sound-img', src: './img/icons/sounds.png', alt: 'sounds on/off', width: '40', height: '40' }
        },
        theme: {
          label: { tag: 'label', id: 'switch-theme', className: 'settings__theme theme' },
          input: { tag: 'input', className: 'theme__input', type: 'checkbox', id: 'slider' },
          span: { tag: 'span', className: 'theme__slider round' }
        }
      }
    }
  }
  generateNode() {
    return {
      header: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.header),
      h1: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.h1),
      options: {
        wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.wrap),
        timer: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.timer.wrap),
          imgWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.timer.imgWrap),
          img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.timer.img),
          timeWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.timer.timeWrap),
          time: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.timer.time),
        },
        refresh: {
          a: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.refresh.a),
          img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.refresh.img),
        },
        showAnswer: {
          a: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.showAnswer.a),
          img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.showAnswer.img),
        },
        saveLoad: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.saveLoad.wrap),
          save: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.saveLoad.save),
          saveImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.saveLoad.saveImg),
          load: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.saveLoad.load),
          loadImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.options.saveLoad.loadImg),
        },
      },
      settings: {
        wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.settings.wrap),
        sound: {
          a: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.settings.sound.a),
          img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.settings.sound.img),
        },
        theme: {
          label: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.settings.theme.label),
          input: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.settings.theme.input),
          span: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.settings.theme.span)
        }
      }
    };
  }

  updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    this._elements.options.timer.time.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  setSaveEnabled(){
    this._elements.options.saveLoad.save.classList.remove('disable');
  }
  setLoadEnable() {
    this._elements.options.saveLoad.load.classList.remove('disable');
  }

  _refreshClickHandler(evt) {
    evt.preventDefault();
    this._callback.refreshClick();
  }

  _showAnswersClickHandler(evt) {
    evt.preventDefault();
    this._callback.showAnswers();
  }

  _saveClickHandler(evt) {
    evt.preventDefault();
    this._callback.saveClick();
  }
  _loadClickHandler(evt) {
    evt.preventDefault();
    this._callback.loveClick();
  }

  setRefreshClickHandler(callback) {
    this._callback.refreshClick = callback;
    this._elements.options.refresh.a.addEventListener(`click`, this._refreshClickHandler);
  }

  setShowAnswersClickHandler(callback) {
    this._callback.showAnswers = callback;
    this._elements.options.showAnswer.a.addEventListener(`click`, this._showAnswersClickHandler);
  }

  setSaveClickHandler(callback) {
    this._callback.saveClick = callback;
    this._elements.options.saveLoad.save.addEventListener(`click`, this._saveClickHandler);
  }

  setLoadClickHandler(callback) {
    this._callback.loveClick = callback;
    this._elements.options.saveLoad.load.addEventListener(`click`, this._loadClickHandler);
  }
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
  constructor(crossword) {
    super();
    this._crossword = crossword.playTable;
    this._isGameStop = false;
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._cellClickHandler = this._cellClickHandler.bind(this);
    this._cellClickContextHandler = this._cellClickContextHandler.bind(this);
  }
  getStructure() {
    const node = {
      element: this._elements.table,
      child: []};
    
    this._elements.rows.forEach(rowEl => {
      const tdCells = [];
      rowEl.cells.forEach(cellEl => {
        tdCells.push({element: cellEl.td});
      });

      node.child.push({
        element: rowEl.tr,
        child: tdCells
      });
      
    })
    
    return node;
  }

  generateNode() {
    const hint = this.generateHint(this._crossword);

    const node = {
      table: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'table', className: 'game__crossword crossword'}),
      rows: []
    }

    for (let i = 0; i < hint.maxV; i += 1) {
      node.rows.push({
        tr: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'tr', className: 'row'}),
        cells: []
      });

      for (let j = 0; j < hint.maxH; j += 1) {
        node.rows[i].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'td', className: 'empty'})
        })
      }

      for (let j = 0; j < hint.vertical.length; j += 1) {
        node.rows[i].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'td', className: 'cell hint', textContent: hint.vertical[j][i] ? hint.vertical[j][i] : ''})
        })
      }
    }

    for(let i = 0; i < this._crossword.length; i += 1) {
      node.rows.push({
        tr: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'tr'}),
        cells: []
      });
      for (let j = 0; j < hint.maxH; j += 1) {
        node.rows[i + hint.maxV].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'td', className: 'cell hint', textContent: hint.horizontal[i][j] ? hint.horizontal[i][j] : ''})
        })
      }
      for (let j = 0; j < this._crossword.length; j += 1) {
        node.rows[i + hint.maxV].cells.push({
          td: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'td', className: `cell`, data: `el-${i}-${j}`})
        })
      }
    }

    return node;

  }
  
  generateHint(crossword) {
    const rows = crossword.length;
    const cols = crossword[0].length;

    const horizontal = [];
    const vertical = [];

    for (let i = 0; i < rows; i += 1) {
      let consistency = 0;
      const rowHints = [];
      for(let j = 0; j < cols; j += 1) {
        if(crossword[i][j] === "1") consistency += 1;
        if(crossword[i][j] === "0" && consistency > 0) {
          rowHints.push(consistency);
          consistency = 0;
        }
      }
      if(consistency > 0) {
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

    const alignedHorizontalHints = horizontal.map(row => {
      const emptyEl = Array(maxHorizontalLength - row.length).fill(0);
      return emptyEl.concat(row);
    });

    const alignedVerticalHints = vertical.map(cell => {
      const emptyEl = Array(maxVerticalLength - cell.length).fill(0);
      return emptyEl.concat(cell);
    });

    return {
      maxH: maxHorizontalLength,
      maxV: maxVerticalLength,
      horizontal: alignedHorizontalHints,
      vertical: alignedVerticalHints,
    }
  }

  _cellClickHandler(evt) {
    if (this._isGameStop) {
      return;
    }
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("hint--off")) evt.target.classList.remove("hint--off");
      else evt.target.classList.add("hint--off")
    } else {
      let command = '';
      if (evt.target.classList.contains("cross")) evt.target.classList.remove("cross");
      if (evt.target.classList.contains("fill")) {
        evt.target.classList.remove("fill");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.EMPTY;
      }
      else {
        evt.target.classList.add("fill");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.FILL;
      }

      const indexEl = this._getIndex(evt.target.data);
      this._callback.cellClick(indexEl, command);
    }

    evt.preventDefault();
    
  }

  _cellClickContextHandler(evt) {
    if (this._isGameStop) {
      return;
    }
    evt.preventDefault();
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (!evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("fill")) evt.target.classList.remove("fill");

      let command = '';
      if (evt.target.classList.contains("cross")) {
        evt.target.classList.remove("cross");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.EMPTY
      } else {
        evt.target.classList.add("cross");
        command = _utils_const_js__WEBPACK_IMPORTED_MODULE_2__.COMMAND.CROSS;
      }

      const indexEl = this._getIndex(evt.target.data);
      this._callback.cellClick(indexEl, command);
    }
  }

  _getIndex(data) {
    const indexArr = data.split('-');
    const index = {
      i: indexArr[1],
      j: indexArr[2]
    }
    return index;
  }

  stopGame() {
    this._isGameStop = true;
  }
  startGame() {
    this._isGameStop = false;
  }

  loadGame(crossword, answers){
    this._crossword = crossword.playTable;
    this.setAnswersCrossword(answers);

  }
  setClearCrossword() {
    this._elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove('fill', 'cross', 'hint--off')
      })
    })
  }

  setAnswersCrossword(answer) {
    this._elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove('fill', 'cross', 'hint--off')
        if(!(cell.td.classList.contains('empty') || cell.td.classList.contains('hint'))) {
          const index = this._getIndex(cell.td.data);
          switch (answer[index.i][index.j]){
            case '1':
              cell.td.classList.add("fill");
              break;
            case '0':
              cell.td.classList.add("cross");
              break;
            }
          // if (answer[index.i][index.j] === '1') cell.td.classList.add("fill");
        }
      })
    })
  }

  setCellClickHandler(callback) {
    this._callback.cellClick = callback;
    this.getElement().addEventListener(`click`, this._cellClickHandler);
    this.getElement().addEventListener(`contextmenu`, this._cellClickContextHandler);
  }

  deleteCellClickHandler() {
    this.getElement().removeEventListener(`click`, this._cellClickHandler);
  }
}

/***/ }),

/***/ "./src/js/view/end-game.js":
/*!*********************************!*\
  !*** ./src/js/view/end-game.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EndGame)
/* harmony export */ });
/* harmony import */ var _abstract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract.js */ "./src/js/view/abstract.js");
/* harmony import */ var _utils_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/render.js */ "./src/js/utils/render.js");



class EndGame extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(time) {
    super();
    this._time = time;
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._playAgainClickHandler = this._playAgainClickHandler.bind(this);
  }

  getStructure() {
    return {
      element: this._elements.aside,
      child: [
        {
          element: this._elements.window,
          child: [
            {
              element: this._elements.div,
              child: 
                [{element: this._elements.titleWrap,
                    child: 
                      [{element: this._elements.img},
                      {element: this._elements.title}]},
                {element: this._elements.information},
                {element: this._elements.closeBtn,
                child: [{element: this._elements.closeImg}]},
              ],
            },
          ]
        }
      ],
    };
  }
  getElementProperties() {
    return {
      aside: {tag: "aside", className: "modal-results"},
      window: {tag: "div", className: "modal-results__window"},
      div: {tag: "div", className: "modal-results__wrapper"},
      titleWrap: {tag: "div", className: "modal-results__title-wrap"},
      title: {tag: "h2", className: "modal-results__title", textContent: `Great! `},
      img: {tag: 'img', className: 'modal-results__img', src: './img/icons/results.png', alt: `Winner's medal`, width: '40', height: '40'},
      information: {tag: "p", className: "modal-results__information",textContent: `You have solved the nanograms in ${this._time} seconds!`},
      closeBtn: {tag: "a", className: "modal-results__button"},
      closeImg: {tag: 'img', className: 'modal-results__button-img', src: './img/icons/win.png', alt: 'Close window', width: '40', height: '40'}
    }
  }
  generateNode() {
    return {
      aside: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.aside),
      window: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.window),
      div: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.div),
      titleWrap:  (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.titleWrap),
      title: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.title),
      img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.img),
      information: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.information),
      closeBtn: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.closeBtn),
      closeImg:  (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.closeImg),
    };
  }

  _playAgainClickHandler(evt) {
    evt.preventDefault();
    this._callback.playAgainClick();
  }

  setPlayAgainClickHandler(callback) {
    this._callback.playAgainClick = callback;
    this._elements.closeBtn.addEventListener(
      `click`,
      this._playAgainClickHandler,
    );
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
  constructor(crosswords) {
    super();
    this._crosswords = crosswords;
    // this._crossword = crossword;
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._gameClickHandler = this._gameClickHandler.bind(this);
  }

  getStructure() {
    const nodeList = [];
    this._elements.gallery.forEach(elNode => {
      const newNode = {
        element: elNode.exWrap,
          child: [
            {element: elNode.exImg},
            {element: elNode.exName},
            {element: elNode.level.wrap,
              child: Array.from({ length: Number(elNode.level.levelNumber) }, (el, i) => elNode.level[`star${i + 1}`])
            }
          ]
        };

        nodeList.push(newNode);
    })

    const node = {
      element: this._elements.aside,
      child: [
        {
          element: this._elements.window,
          child: [
            {
              element: this._elements.windowWrap,
              child: 
                [{element: this._elements.titleWrap,
                    child: 
                      [{element: this._elements.title},
                      {element: this._elements.closeBtn,
                        child: [{element: this._elements.closeImg}]}]},
                {element: this._elements.galleryWrap,
                  child: nodeList},
              ],
            },
          ]
        }
      ],
    };

    
    return node;
  }
  getElementProperties() {
    return {
      aside: {tag: "aside", className: "modal-gallery"},
      window: {tag: "div", className: "modal-gallery__window"},
      windowWrap: {tag: "div", className: "modal-gallery__wrapper"},
      titleWrap: {tag: "div", className: "modal-gallery__title-wrap"},
      title: {tag: "h2", className: "modal-gallery__title", textContent: `Gallery`},
      closeBtn: {tag: "a", className: "modal-gallery__button"},
      closeImg: {tag: 'img', className: 'modal-gallery__button-img', src: './img/icons/close.png', alt: 'Close window', width: '40', height: '40'},
      galleryWrap: {tag: "div", className: "modal-gallery__gallery-wrap"},
      levelWrap: {tag: 'div', className: 'modal-gallery__level-wrapper'},
      star: {tag: 'img', className: 'modal-gallery__level-img', src: './img/icons/level.png', alt: 'star level', width: '40', height: '40'}
    }
  }
  generateNode() {
    const node = {
      aside: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.aside),
      window: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.window),
      windowWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.windowWrap),
      titleWrap:  (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.titleWrap),
      title: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.title),
      closeBtn: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.closeBtn),
      closeImg:  (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.closeImg),
      galleryWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.galleryWrap),
      gallery: [],
      };

    this._crosswords.forEach(element => {
      const newNode = {
        exWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: "div", className: "modal-gallery__example-wrap", data: `${element.id}`}),
        exImg: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'img', className: 'modal-gallery__example-img', src: `./img/example/${element.img}.png`, alt: `${element.name}`, width: '40', height: '40'}),
        exName: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: "p", className: "modal-gallery__example-name",textContent: `${element.name}`}),
        level: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.levelWrap),
          levelNumber: element.level
        }
      }

      for(let i = 1; i <= element.level; i+=1) {
        newNode.level[`star${i}`] = (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.star);
      }

      node.gallery.push(newNode);
    });

    return node;
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _gameClickHandler(evt) {
    evt.preventDefault();
    this._callback.gameClick(evt.currentTarget.data);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this._elements.closeBtn.addEventListener(
      `click`,
      this._closeClickHandler,
    );
  }
  setGameClickHandler(callback) {
    this._callback.gameClick = callback;
    this._elements.gallery.forEach(game => {
      game.exWrap.addEventListener(
        `click`,
        this._gameClickHandler,
      )
    })
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
  constructor() {
    super();
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
  }
  getStructure() {
    return {
      element: this._elements.main,
      child: [
        {element: this._elements.table.section,
        child: [
          {element: this._elements.table.h2}, 
          {element: this._elements.table.crosswordWrap}]},
        {element: this._elements.additional.section,
        child: [{element: this._elements.additional.h2}]}
      ]
    };
  }
  getElementProperties() {
    return {
      main: {
        tag: 'main',
        className: 'game__wrapper'
      },
      table: {
        section: {
          tag: 'section',
          className: 'game__table table'
        },
        h2: {
          tag: 'h2',
          className: 'visually-hidden',
          textContent: 'Game table'
        },
        crosswordWrap: {
          tag: 'div',
          className: 'game__crossword-wrapper'
        }
      },
      additional: {
        section: {
          tag: 'section',
          className: 'game__additional'
        },
        h2: {
          tag: 'h2',
          className: 'visually-hidden',
          textContent: 'Additional information'
        },
        
      }
    }
  }
  generateNode() {
    return {
      main: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.main),
      table: {
        section: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.table.section),
        h2: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.table.h2),
        crosswordWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.table.crosswordWrap)
      },
      additional: {
        section: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.additional.section),
        h2: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.additional.h2),
      }
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
/* harmony import */ var _model_crossword_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/crossword.js */ "./src/js/model/crossword.js");




class Results extends _abstract_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(results, crosswords) {
    super();
    this._results = results;
    this._crosswords = new _model_crossword_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this._crosswords.setCrosswords(crosswords);
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
  }
  getStructure() {
    const node = {
      element: this._elements.resultsWrap,
      child: [
        {element: this._elements.titleWrap,
          child: [
            {element: this._elements.img}, 
            {element: this._elements.titleP}
          ]
        },
        
      ]
    };
    this._elements.results.forEach(elNode => {
      const newNode = {
        element: elNode.wrapInf,
        child: [
          {element: elNode.resultWrap,
            child: [{element: elNode.p}]},
          {element: elNode.level.wrap,
            child: Array.from({ length: Number(elNode.level.levelNumber) }, (el, i) => elNode.level[`star${i + 1}`])}
        ]};

      node.child.push(newNode);
    })
    
    return node;
  }
  getElementProperties() {
    const node = {
      resultsWrap: {tag: 'div', className: 'game__results results'},
      titleWrap:{tag: 'div', className: 'results__title-wrapper'},
      img: {tag: 'img',className: 'results__img',src: './img/icons/results.png',alt: 'Results table',width: '40',height: '40'},
      titleP: {tag: 'p', className: 'results__title', textContent: 'Results'},
      wrapInf: {tag: 'div', className: 'results__information-wrapper'},
      resultWrap: {tag: 'div', className: 'results__result-wrapper'},
      level: {
        wrap: {tag: 'div', className: 'results__level-wrapper'},
        star: {tag: 'img', className: 'results__level-img', src: './img/icons/level.png', alt: 'star level', width: '40', height: '40'}
      }
    }
    return node;
  }
  generateNode() {
    const node = {
      resultsWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.resultsWrap),
      titleWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.titleWrap),
      img: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.img),
      titleP: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.titleP),
      
      results: []
    };

    this._results.forEach(result => {
      const cross = this._crosswords.getElementById(result.id);
      const newResultNode = {
        wrapInf: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.wrapInf),
        resultWrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.resultWrap),
        p: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)({tag: 'p', className: 'results__information', textContent: `${result.time} - ${cross.name}`}),
        level: {
          wrap: (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.level.wrap),
          levelNumber: cross.level
        }
      };

      for(let i = 1; i <= cross.level; i+=1) {
        newResultNode.level[`star${i}`] = (0,_utils_render_js__WEBPACK_IMPORTED_MODULE_1__.createElement)(this._tagsProperties.level.star);
      }
      node.results.push(newResultNode); 
      
    });
    return node;
  }
}

/***/ }),

/***/ "./src/mock/mock.json":
/*!****************************!*\
  !*** ./src/mock/mock.json ***!
  \****************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"id":"1.1","name":"Badminton","level":"1","img":"badminton","playTable":[["0","0","0","0","0"],["0","0","1","1","0"],["1","1","1","1","0"],["0","1","1","0","0"],["0","0","1","0","0"]]},{"id":"1.2","name":"Hamburger","level":"1","img":"hamburger","playTable":[["0","1","1","1","0"],["1","1","0","0","1"],["1","1","1","1","1"],["1","1","0","0","1"],["0","1","1","1","0"]]},{"id":"1.3","name":"Cup","level":"1","img":"cup","playTable":[["1","1","1","1","1"],["1","0","0","0","1"],["1","0","0","0","1"],["0","1","0","1","0"],["1","1","1","1","1"]]},{"id":"1.4","name":"Skull","level":"1","img":"skull","playTable":[["0","1","1","1","0"],["1","1","1","1","1"],["1","0","1","0","1"],["1","1","1","1","1"],["0","1","1","1","0"]]},{"id":"1.5","name":"Yoda","level":"1","img":"yoda","playTable":[["0","0","1","0","0"],["1","1","1","1","1"],["0","1","0","1","0"],["1","0","0","0","1"],["0","1","1","1","0"]]},{"id":"2.1","name":"Cheburashka","level":"2","img":"cheburashka","playTable":[["0","1","1","1","0","0","1","1","1","0"],["1","0","0","0","1","1","0","0","0","1"],["1","0","0","0","0","0","0","0","0","1"],["1","0","0","1","0","0","1","0","0","1"],["1","1","0","0","1","1","0","0","1","1"],["0","0","1","0","0","0","0","1","0","0"],["0","1","1","0","0","0","0","1","1","0"],["0","1","1","1","0","0","1","1","1","0"],["0","0","1","1","1","1","1","1","0","0"],["0","1","1","1","0","0","1","1","1","0"]]},{"id":"2.2","name":"Penguin","level":"2","img":"penguin","playTable":[["0","0","0","0","0","0","0","0","0","0"],["0","0","0","1","1","1","1","0","0","0"],["0","0","1","0","1","1","0","1","0","0"],["0","0","1","1","0","0","1","1","0","0"],["0","1","0","0","0","0","0","0","1","0"],["0","1","0","0","0","0","0","0","1","0"],["1","1","0","0","0","0","0","0","1","1"],["0","1","1","0","0","0","0","1","1","0"],["0","0","1","1","0","0","1","1","0","0"],["0","1","1","1","1","1","1","1","1","0"]]},{"id":"2.3","name":"Butterfly","level":"2","img":"butterfly","playTable":[["0","0","0","1","0","0","1","0","0","0"],["0","0","0","0","1","1","0","0","0","0"],["0","1","1","0","0","0","0","1","1","0"],["0","1","0","1","0","0","1","0","1","0"],["0","1","1","0","1","1","0","1","1","0"],["0","0","1","1","1","1","1","1","0","0"],["0","1","1","0","1","1","0","1","1","0"],["0","1","1","1","1","1","1","1","1","0"],["0","0","0","1","1","0","1","1","0","0"],["0","0","0","0","0","0","0","0","0","0"]]},{"id":"2.4","name":"Camera","level":"2","img":"camera","playTable":[["0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0"],["0","0","1","0","1","1","0","0","0","0"],["0","1","1","1","1","1","1","1","1","0"],["0","1","1","1","1","1","1","1","1","0"],["0","1","1","1","0","0","1","1","1","0"],["0","1","1","1","0","0","1","1","1","0"],["0","1","1","1","1","1","1","1","1","0"],["0","1","1","1","1","1","1","1","1","0"],["0","0","0","0","0","0","0","0","0","0"]]},{"id":"2.5","name":"Dolphin","level":"2","img":"dolphin","playTable":[["0","0","0","0","0","0","0","0","0","0"],["0","0","1","1","1","1","1","1","0","0"],["0","0","0","1","1","1","1","1","1","0"],["0","0","1","1","1","1","1","0","0","0"],["0","0","1","1","1","0","0","0","0","0"],["0","0","1","1","0","0","0","0","0","0"],["0","0","0","1","0","0","0","0","0","0"],["0","0","0","1","1","0","0","0","0","0"],["0","0","0","1","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0"]]},{"id":"3.1","name":"Calibre","img":"calibre","level":"3","playTable":[["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","1","0","0","0","0","0","0","0","0"],["0","0","1","1","1","0","1","0","0","0","0","0","0","0","0"],["0","0","1","0","1","1","1","1","0","0","0","0","0","0","0"],["0","0","1","0","0","1","1","1","0","1","1","1","1","1","0"],["0","0","0","1","0","0","1","1","1","1","1","0","0","0","0"],["0","0","0","0","1","0","0","1","1","1","0","0","0","0","0"],["0","0","0","0","0","1","1","1","0","1","0","0","0","0","0"],["0","0","0","0","0","1","1","0","0","1","0","0","0","0","0"],["0","0","0","0","1","1","1","0","1","0","0","0","0","0","0"],["0","0","0","0","1","1","0","0","0","0","0","0","0","0","0"],["0","0","0","1","0","1","0","0","0","0","0","0","0","0","0"],["0","0","0","1","0","1","0","0","0","0","0","0","0","0","0"],["0","0","0","1","1","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]]},{"id":"3.2","name":"Unicorn","level":"3","img":"unicorn","playTable":[["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","1","0"],["0","0","0","0","0","0","0","1","0","0","0","0","1","1","0"],["0","0","0","0","0","0","1","1","1","1","1","1","1","0","0"],["0","0","0","0","1","1","1","0","0","1","1","1","1","0","0"],["0","0","0","0","1","1","1","0","0","0","0","1","0","0","0"],["0","0","0","1","1","0","1","0","0","0","0","1","0","0","0"],["0","0","1","1","1","0","0","0","0","1","0","1","0","0","0"],["0","0","1","1","1","0","0","0","0","0","0","0","1","0","0"],["0","0","1","0","0","0","0","1","1","1","0","0","1","1","0"],["0","1","1","0","0","0","0","1","0","0","1","1","1","1","0"],["0","0","0","1","0","0","0","1","0","0","0","1","1","0","0"],["0","0","0","0","1","1","0","1","0","0","0","0","0","0","0"],["0","0","0","0","0","0","1","1","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]]},{"id":"3.3","name":"Footprint","img":"footprint","level":"3","playTable":[["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","1","1","0","1","1","0","0","0","0","0"],["0","0","0","0","1","1","1","0","1","1","1","0","0","0","0"],["0","0","0","0","1","1","1","0","1","1","1","0","0","0","0"],["0","0","1","1","0","1","1","0","1","1","0","1","1","0","0"],["0","0","1","1","1","0","0","1","0","0","1","1","1","0","0"],["0","0","1","1","1","0","1","1","1","0","1","1","1","0","0"],["0","0","0","0","0","1","1","1","1","1","0","0","0","0","0"],["0","0","0","0","1","1","1","1","1","1","1","0","0","0","0"],["0","0","0","1","1","1","1","1","1","1","1","1","0","0","0"],["0","0","0","1","1","1","1","1","1","1","1","1","0","0","0"],["0","0","0","0","1","1","1","1","1","1","1","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]]},{"id":"3.4","name":"Octopus","img":"octopus","level":"3","playTable":[["0","0","0","0","0","0","0","1","0","0","0","0","0","0","0"],["0","0","0","0","0","0","1","1","1","0","0","0","0","0","0"],["0","0","0","0","0","1","1","1","1","1","0","0","0","0","0"],["0","0","0","0","0","1","1","1","1","1","0","0","0","0","0"],["0","0","0","1","1","1","0","1","0","1","1","1","0","0","0"],["0","0","0","0","1","0","1","1","1","0","1","0","0","0","0"],["0","0","0","0","1","0","1","1","1","0","1","0","0","0","0"],["0","1","1","1","1","1","1","1","1","1","1","1","1","1","0"],["0","1","0","1","0","1","1","1","1","1","0","1","0","1","0"],["0","0","1","0","1","1","1","0","1","1","1","0","1","0","0"],["0","0","0","1","1","0","1","0","1","0","1","1","0","0","0"],["0","0","0","0","0","0","1","0","1","0","0","0","0","0","0"],["0","0","0","0","0","1","1","0","1","1","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]]},{"id":"3.5","name":"Bull","img":"bull","level":"3","playTable":[["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","1","0","0","0","0","0","0","0","0","0","0","0","1","0"],["0","1","1","0","0","0","1","1","1","0","0","0","1","1","0"],["0","1","0","1","0","1","1","1","1","1","0","1","0","1","0"],["0","0","1","1","1","1","1","1","1","1","1","1","1","0","0"],["0","1","1","1","0","1","1","1","1","1","0","1","1","1","0"],["0","0","0","0","1","0","1","1","1","0","1","0","0","0","0"],["0","0","0","0","1","1","1","1","1","1","1","0","0","0","0"],["0","0","0","0","0","1","1","1","1","1","0","0","0","0","0"],["0","0","0","0","0","1","0","0","0","1","0","0","0","0","0"],["0","0","0","0","0","1","1","0","1","1","0","0","0","0","0"],["0","0","0","0","0","1","1","1","1","1","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]]}]');

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
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/main.scss */ "./src/scss/main.scss");
/* harmony import */ var _mock_mock_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mock/mock.json */ "./src/mock/mock.json");
/* harmony import */ var _model_crossword_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/crossword.js */ "./src/js/model/crossword.js");
/* harmony import */ var _presenter_nanograms_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./presenter/nanograms.js */ "./src/js/presenter/nanograms.js");





const siteBodyElement = document.querySelector(`body`);

if (siteBodyElement !== null) {
  const crosswordModel = new _model_crossword_js__WEBPACK_IMPORTED_MODULE_2__["default"]();

  const initData = (data) => {
    const crosswords = data.map(crosswordModel.adaptToClient);
    crosswordModel.setCrosswords(crosswords);
  };

  initData(_mock_mock_json__WEBPACK_IMPORTED_MODULE_1__);

  const nanogramsPresenter = new _presenter_nanograms_js__WEBPACK_IMPORTED_MODULE_3__["default"](siteBodyElement);
  nanogramsPresenter.init(crosswordModel.getCrosswords());
}
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map