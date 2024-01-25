import { render, remove } from "../utils/render.js";
import { COMMAND, STORE_NAME } from "../utils/const.js";
import ControlsView from "../view/controls.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import ResultsView from "../view/results.js";
import CrosswordView from "../view/crossword.js";
import EndGameView from "../view/end-game.js";
import GalleryView from "../view/gallery.js";
import CrosswordModel from "../model/crossword.js";

export default class Nanograms {
  constructor(gameContainer) {
    this._gameContainer = gameContainer;
    this._controlsComponent = new ControlsView();
    this._mainComponent = new MainView();
    
  }

  init(crosswords) {
    this._crossModel = new CrosswordModel();
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
    
    this._choseComponent = new ChoseView(this._currentCrossword);
    this._crosswordComponent = new CrosswordView(this._currentCrossword);
    this._resultsComponent = new ResultsView(this._results, this._crossModel.getCrosswords());
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

    render(this._gameContainer, this._controlsComponent);
    render(this._gameContainer, this._mainComponent);

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

    render(this._mainComponent._elements.additional.section, this._choseComponent);
    render(this._mainComponent._elements.additional.section, this._resultsComponent);
    render(this._mainComponent._elements.table.crosswordWrap, this._crosswordComponent);
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
    this._galleryComponent = new GalleryView(this._crossModel.getCrosswords());
    render(this._gameContainer, this._galleryComponent);
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
    

    this._endGameComponent = new EndGameView(finishTime);

    render(this._gameContainer, this._endGameComponent);

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
    remove(this._galleryComponent);
  }

  _destroyResultModal() {
    remove(this._endGameComponent);
  }

  _destroyGameResult() {
    remove(this._crosswordComponent);
    remove(this._choseComponent);
    remove(this._resultsComponent);
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

    this._isHaveSaveGame = true;
    this._controlsComponent.setLoadEnable();
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