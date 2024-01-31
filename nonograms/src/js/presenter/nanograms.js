import { render, remove } from "../utils/render.js";
import { COMMAND, STORE_NAME } from "../utils/const.js";
import { deepCopy, getClearMatrix, compareMatrix } from "../utils/utils.js";
import ControlsView from "../view/controls.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import ResultsView from "../view/results.js";
import CrosswordView from "../view/crossword.js";
import EndGameView from "../view/end-game.js";
import GalleryView from "../view/gallery.js";
import CrosswordModel from "../model/crossword.js";

export default class Nanograms {
  constructor(gameContainer, crosswords) {
    this._gameContainer = gameContainer;
    this._components = {
      controls: new ControlsView(),
      main: new MainView(),
    }
    
    this._crossModel = new CrosswordModel();
    this._crossModel.setCrosswords(crosswords);

    this._results = [];
    this._saveGame = {};

    this._settings = {
      isHaveSaveGame: false,
      isGameStarted: false,
      isShowAnswers: false,
    }

    this._getResultFromStorage();
    this._getSaveFromStorage();
  }

  startGame() {

    this._resetSettings();
    this._renderBase();
    this._getRandomCrossword();
    this._setAnswers();
    this._updateGameComponents();
    this._renderGame();
    
  }

  _resetSettings(){
    this._resetTimer();
    this._settings.isGameStarted = false;
    this._settings.isShowAnswers = false;
  }

  _getRandomCrossword() {
    this._currentCrossword = this._crossModel.getRandomCrossword();
  }

  _setAnswers(answers = undefined) {
    if (answers)  this._answers = deepCopy(answers);
    else this._answers = getClearMatrix(this._currentCrossword.playTable.length);
  }

  _updateGameComponents() {
    this._components["chose"] = new ChoseView(this._currentCrossword);
    this._components["crossword"] = new CrosswordView(this._currentCrossword);
    this._components["results"] = new ResultsView(this._results, this._crossModel.getCrosswords());
  }

  _renderBase() {
    const onRefreshClick = () => {
      this._setAnswers();
      this._resetSettings();
      this._components["crossword"].setClearCrossword();
      this._components["crossword"].startGame();
    };

    const onShowAnswersClick = () => {
      this._setAnswers(this._currentCrossword.playTable);
      this._components["crossword"].setAnswersCrossword(this._currentCrossword.playTable);
      this._components["crossword"].stopGame();
      this._resetSettings();
      this._settings.isShowAnswers = true;

    };

    const onSaveClick = () => {
      this._saveGameToStorage();
    };
    const onLoadClick = () => {
      this._loadGame();
    };
    const onThemeClick = () => {
      this._gameContainer.classList.toggle('light-theme');
      this._gameContainer.classList.toggle('dark-theme');
    };

    render(this._gameContainer, this._components['controls']);
    render(this._gameContainer, this._components['main']);

    this._components['controls'].setRefreshClickHandler(onRefreshClick);
    this._components['controls'].setShowAnswersClickHandler(onShowAnswersClick);
    this._components['controls'].setSaveClickHandler(onSaveClick);
    this._components['controls'].setLoadClickHandler(onLoadClick);
    this._components['controls'].setThemeClickHandler(onThemeClick);

    
  }

  _renderGame() {
    const onCellClick = (index, command) => {
      if(!this._settings.isShowAnswers) {
        if(!this._settings.isGameStarted) {
          this._settings.isGameStarted = true;
          this._components["controls"].setSaveEnabled();
          this._startTimer();
        }
        this._setNextGameStep(index, command);
      }
    };

    const onRandomClick = () => {
      const audio = new Audio(`./muz/random.mp3`);
      audio.play();
      this._resetSettings();
      this._restartGame();
    };

    const onShowGalleryClick = () => {
      this._showGallery();
    }

    render(this._components['main']._elements.additional.section, this._components['chose']);
    render(this._components['main']._elements.additional.section, this._components['results']);
    render(this._components['main']._elements.table.crosswordWrap, this._components['crossword']);
    this._components['crossword'].setCellClickHandler(onCellClick);
    this._components['chose'].setRandomClickHandler(onRandomClick);
    this._components['chose'].setShowGalleryClickHandler(onShowGalleryClick);
  }

  _setNextGameStep(index, command) {
    this._setNewAnswer(index, command);
    let fileName = '';
    switch(command) {
      case COMMAND.FILL:
        fileName = 'click';
        break;
      case COMMAND.EMPTY:
        fileName = 'click';
        break;
      case COMMAND.CROSS:
        fileName = 'click-context';
        break;
    }
    const audio = new Audio(`./muz/${fileName}.mp3`);
    audio.play();
  }

  _setNewAnswer(index, command) {
    switch(command){
      case COMMAND.FILL:
        this._answers[index.i][index.j] = '1';
        break;
      case COMMAND.EMPTY:
        this._answers[index.i][index.j] = '';
        break;
      case COMMAND.CROSS:
        this._answers[index.i][index.j] = '0';
        break;
    }

    if (this._isFinish()) this._showEndGameInformation();
  }
  
  _loadGame(){
    if (this._settings.isHaveSaveGame) {
      this._getSaveFromStorage();
      this._destroyGameComponents();
      this._resetSettings();
      this._seconds = Number(this._saveGame['seconds']);
      this._currentCrossword = this._saveGame['crossword'];
      this._components["controls"].updateTimerDisplay(this._seconds);
      this._setAnswers(this._saveGame['answers']);
      this._updateGameComponents();
      this._renderGame();
      this._components["crossword"].setAnswersCrossword(this._answers);
    }
  }


  _startTimer() {
    if (!this._timer) {
      this._timer = setInterval(() => {
        if(!this._settings.isGameStarted) this._resetTimer();
        this._seconds += 1;
        this._components["controls"].updateTimerDisplay(this._seconds);
      }, 1000);
    }
  }

  _resetTimer() {
    if(this._timer) clearInterval(this._timer);
    this._timer = null;
    this._seconds = 0;
    this._components["controls"].updateTimerDisplay(this._seconds);
  }

  _isFinish() {
    return compareMatrix(this._answers, this._currentCrossword.playTable);
  }

  _getTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  _showGallery() {
    const onCloseClick = () => {
      this._destroyGalleryModal();
    };
    const onGameClick = (data) => {
      this._destroyGalleryModal();
      if (data) {
        this._destroyGameComponents();
        this._currentCrossword = this._crossModel.getElementById(data);
        this._setAnswers();
        this._resetSettings();
        this._updateGameComponents();
        this._renderGame();
      }
    };
    this._components['gallery'] = new GalleryView(this._crossModel.getCrosswords());
    render(this._gameContainer, this._components['gallery']);
    this._components['gallery'].setCloseClickHandler(onCloseClick);
    this._components['gallery'].setGameClickHandler(onGameClick);
  }

  _updateResultInformation(finishTime) {
    this._results.reverse();
    this._results.push({time: finishTime,
    id: this._currentCrossword.id});
    this._results.reverse();
    this._results = this._results.slice(0, 5);
    this._setResultToStorage();
  }


  _showEndGameInformation() {
    const finishTime = this._getTime(this._seconds);
    this._resetSettings();
    this._updateResultInformation(finishTime);
    
    this._components["endGame"] = new EndGameView(finishTime);
    render(this._gameContainer, this._components["endGame"]);

    const onPlayAgainClick = () => {
      this._destroyResultModal();
      this._restartGame();
    };

    this._components['endGame'].setPlayAgainClickHandler(onPlayAgainClick);
  }

  _restartGame() {
    this._destroyGameComponents();
    this._getRandomCrossword();
    this._setAnswers();
    this._updateGameComponents();
    this._renderGame();
  }

  _destroyGalleryModal() {
    remove(this._components['gallery']);
  }

  _destroyResultModal() {
    remove(this._components['endGame']);
  }

  _destroyGameComponents() {
    remove(this._components['crossword']);
    remove(this._components['chose']);
    remove(this._components['results']);
  }

  _setResultToStorage() {
    window.localStorage.setItem(
      `${STORE_NAME}-result-table`,
      this._results.map(el => `${el.time}-${el.id}`),
    );
  }

  _saveGameToStorage() {
    const id = this._currentCrossword.id;
    const answers = this._answers.join('-');

    this._settings.isHaveSaveGame = true;
    this._components['controls'].setLoadEnable();
    this._saveGame['crossword'] = this._currentCrossword;
    this._saveGame['seconds'] = this._seconds;
    this._saveGame['answers'] = this._answers;

    window.localStorage.setItem(
      `${STORE_NAME}-save-game`, `${id}:${this._seconds}:${answers}`);
  }

  _getResultFromStorage() {
    let resultsTable = window.localStorage.getItem(
      `${STORE_NAME}-result-table`,
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
      `${STORE_NAME}-save-game`,
    );

    if (saveGame) {
      saveGame = saveGame.split(':');
      if (saveGame.length) {
        try{
          this._settings.isHaveSaveGame = true;
          this._saveGame['crossword'] = this._crossModel.getElementById(saveGame[0]);
          this._saveGame['seconds'] = saveGame[1];
          const answers = saveGame[2].split('-');
          this._saveGame['answers'] = answers.map(row => row.split(','));
          this._components['controls'].setLoadEnable();
        } catch (e) {
          console.log("We have some problems with your save game");
        }
        
      }
      
    }
  }
}