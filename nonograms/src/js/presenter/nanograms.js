import { render, remove } from "../utils/render.js";
import { COMMAND, STORE_NAME } from "../utils/const.js";
import ControlsView from "../view/controls.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import ResultsView from "../view/results.js";
import CrosswordView from "../view/crossword.js";
import EndGameView from "../view/end-game.js";

export default class Nanograms {
  constructor(gameContainer) {
    this._gameContainer = gameContainer;
    this._controlsComponent = new ControlsView();
    this._mainComponent = new MainView();
    
  }

  init(crosswords) {
    this._crosswords = crosswords;
    this._results = [];
    this._getStorage();
    this._renderBase();
    this._startNewGame();
  }

  _startNewGame() {
    this._timer = undefined;
    this._seconds = 0;
    this._isGameStarted = false;
    this._isShowAnswers = false;
    this._currentCrossword = this._getRandomCrossword();
    this._answers = this._clearAnswers();
    this._choseComponent = new ChoseView(this._currentCrossword);
    this._crosswordComponent = new CrosswordView(this._currentCrossword);
    this._resultsComponent = new ResultsView(this._results, this._crosswords);
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
      this._crosswordComponent.setAnswersCrossword();
      this._isGameStarted = false;
      this._isShowAnswers = true;
      this._crosswordComponent.stopGame();
      this._resetTimer();
    };

    render(this._gameContainer, this._controlsComponent);
    render(this._gameContainer, this._mainComponent);

    this._controlsComponent.setRefreshClickHandler(onRefreshClick);
    this._controlsComponent.setShowAnswersClickHandler(onShowAnswersClick);
  }

  _renderGame() {
    const onCellClick = (index, command) => {
      if(!this._isShowAnswers) {
        if(!this._isGameStarted) {
          this._isGameStarted = true;
          this._startTimer();
        }
        this._setNextGameStep(index, command);
      }
    };

    const onRandomClick = () => {
      this._restartGame();
    };

    render(this._mainComponent._elements.additional.section, this._choseComponent);
    render(this._mainComponent._elements.additional.section, this._resultsComponent);
    render(this._mainComponent._elements.table.crosswordWrap, this._crosswordComponent);
    this._crosswordComponent.setCellClickHandler(onCellClick);
    this._choseComponent.setRandomClickHandler(onRandomClick);
  }

  _setNextGameStep(index, command) {
    
      this._setNewAnswer(index, command);
      
  }

  _setNewAnswer(index, command) {
    
    this._answers[index.i][index.j] = command === COMMAND.FILL ? '1' : '0';

    if (this._isFinish()) this._showEndGameInformation();
  }


  _clearAnswers() {
    return Array.from({ length: this._currentCrossword.playTable.length }, () => Array(this._currentCrossword.playTable.length).fill('0'));
  }
  _getRandomCrossword() {
    let newCrossword = this._getNextCrossword();
    while (this._currentCrossword === newCrossword) {
      newCrossword = this._getNextCrossword();
    }
    return newCrossword;
  }

  _getNextCrossword() {
    return this._crosswords[Math.floor(Math.random() * this._crosswords.length)];
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
    if(this._timer) {
      clearInterval(this._timer);
      this._timer = null;
      this._seconds = 0;
      this._controlsComponent.updateTimerDisplay(this._seconds);
    }
    
  }

  _isFinish() {
    return JSON.stringify(this._currentCrossword.playTable) === JSON.stringify(this._answers)
  }

  _getTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
    this._startNewGame();
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
  _getStorage() {
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
}