import { render, remove } from "../utils/render.js";
import { COMMAND, STORE_NAME, SOUNDS } from "../utils/const.js";
import { deepCopy, getClearMatrix, compareMatrix } from "../utils/utils.js";
import Store from "../api/store.js";
import Sound from "../api/sound.js";
import ControlsView from "../view/controls.js";
import MainView from "../view/main.js";
import ChoseView from "../view/chose.js";
import ResultsView from "../view/results.js";
import CrosswordView from "../view/crossword.js";
import EndGameView from "../view/end-game.js";
import GalleryView from "../view/gallery.js";
import CrosswordModel from "../model/crossword.js";

export default class Nanograms {
  #gameContainer;
  #components;
  #crossModel;
  #currentCrossword;
  #answers;
  #store;
  #sound;
  #results;
  #seconds;
  #saveGameInf;
  #settings;
  #timer;

  constructor(gameContainer, crosswords) {
    this.#gameContainer = gameContainer;
    this.#components = {
      controls: new ControlsView(),
      main: new MainView(),
    }
    
    this.#crossModel = new CrosswordModel();
    this.#crossModel.setCrosswords(crosswords);

    this.#store = new Store(STORE_NAME, window.localStorage);
    this.#sound = new Sound();

    this.#results = [];
    this.#saveGameInf = {};

    this.#settings = {
      isHaveSaveGame: false,
      isGameStarted: false,
      isShowAnswers: false,
    }

    this.#getResultFromStorage();
    this.#getSaveFromStorage();
  }

  startGame() {

    this.#resetSettings();
    this.#renderBase();
    this.#getRandomCrossword();
    this.#setAnswers();
    this.#updateGameComponents();
    this.#renderGame();
    
  }

  #resetSettings(){
    this.#resetTimer();
    this.#settings.isGameStarted = false;
    this.#settings.isShowAnswers = false;
  }

  #getRandomCrossword() {
    this.#currentCrossword = this.#crossModel.getRandomCrossword(this.#currentCrossword);
  }

  #setAnswers(answers = undefined) {
    if (answers)  this.#answers = deepCopy(answers);
    else this.#answers = getClearMatrix(this.#currentCrossword.playTable.length);
  }

  #updateGameComponents() {
    this.#components["chose"] = new ChoseView(this.#currentCrossword);
    this.#components["crossword"] = new CrosswordView(this.#currentCrossword);
    this.#components["results"] = new ResultsView(this.#results, this.#crossModel.getCrosswords());
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
          this.#startTimer();
        }
        this.#setNextGameStep(index, command);
      }
    };

    const onRandomClick = () => {
      this.#sound.playSound(SOUNDS.RENDER);
      this.#resetSettings();
      this.#restartGame();
    };

    const onShowGalleryClick = () => {
      this.#showGallery();
    }

    render(this.#components['main'].elements.additional.section, this.#components['chose']);
    if(this.#results.length > 0) render(this.#components['main'].elements.additional.section, this.#components['results']);
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

    if (this.#isFinish()) {
      this.#sound.playSound(SOUNDS.WIN);
      this.#showEndGameInformation();
    } else this.#sound.playSound(command === COMMAND.CROSS ? SOUNDS.CROSS : SOUNDS.FILL);
  }
  
  #loadGame(){
    if (this.#settings.isHaveSaveGame) {
      this.#sound.playSound(SOUNDS.RENDER);
      this.#getSaveFromStorage();
      this.#destroyGameComponents();
      this.#resetSettings();
      this.#seconds = Number(this.#saveGameInf['seconds']);
      this.#currentCrossword = this.#saveGameInf['crossword'];
      this.#components["controls"].updateTimerDisplay(this.#seconds);
      this.#setAnswers(this.#saveGameInf['answers']);
      this.#updateGameComponents();
      this.#renderGame();
      this.#components["crossword"].setAnswersCrossword(this.#answers);
    }
  }


  #startTimer() {
    if (!this.#timer) {
      this.#timer = setInterval(() => {
        if(!this.#settings.isGameStarted) this.#resetTimer();
        this.#seconds += 1;
        this.#components["controls"].updateTimerDisplay(this.#seconds);
      }, 1000);
    }
  }

  #resetTimer() {
    if(this.#timer) clearInterval(this.#timer);
    this.#timer = null;
    this.#seconds = 0;
    this.#components["controls"].updateTimerDisplay(this.#seconds);
  }

  #isFinish() {
    return compareMatrix(this.#answers, this.#currentCrossword.playTable);
  }

  #getTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  #showGallery() {
    const onCloseClick = () => {
      this.#destroyGalleryModal();
    };
    const onGameClick = (data) => {
      this.#destroyGalleryModal();
      if (data) {
        this.#sound.playSound(SOUNDS.RENDER);
        this.#destroyGameComponents();
        this.#currentCrossword = this.#crossModel.getElementById(data);
        this.#setAnswers();
        this.#resetSettings();
        this.#updateGameComponents();
        this.#renderGame();
      }
    };
    this.#components['gallery'] = new GalleryView(this.#crossModel.getCrosswords());
    render(this.#gameContainer, this.#components['gallery']);
    this.#components['gallery'].setCloseClickHandler(onCloseClick);
    this.#components['gallery'].setGameClickHandler(onGameClick);
  }

  #updateResultInformation(finishTime) {
    this.#results.reverse();
    this.#results.push({time: finishTime,
    id: this.#currentCrossword.id});
    this.#results.reverse();
    this.#results = this.#results.slice(0, 5);
    this.#store.saveResult(this.#results);
  }


  #showEndGameInformation() {
    const finishTime = this.#getTime(this.#seconds);
    this.#resetSettings();
    this.#updateResultInformation(finishTime);
    
    this.#components["endGame"] = new EndGameView(finishTime);
    render(this.#gameContainer, this.#components["endGame"]);

    const onPlayAgainClick = () => {
      this.#destroyResultModal();
      this.#restartGame();
    };

    this.#components['endGame'].setPlayAgainClickHandler(onPlayAgainClick);
  }

  #restartGame() {
    this.#destroyGameComponents();
    this.#getRandomCrossword();
    this.#setAnswers();
    this.#updateGameComponents();
    this.#renderGame();
  }

  #destroyGalleryModal() {
    remove(this.#components['gallery']);
  }

  #destroyResultModal() {
    remove(this.#components['endGame']);
  }

  #destroyGameComponents() {
    remove(this.#components['crossword']);
    remove(this.#components['chose']);
    remove(this.#components['results']);
  }

  #saveGame() {
    this.#settings.isHaveSaveGame = true;
    this.#components['controls'].setLoadEnable();
    this.#saveGameInf['crossword'] = this.#currentCrossword;
    this.#saveGameInf['seconds'] = this.#seconds;
    this.#saveGameInf['answers'] = this.#answers;

    this.#store.saveGame(this.#saveGameInf);
  }

  #getResultFromStorage() {
    let resultsTable = this.#store.getItem('result-table');
    if (resultsTable) {
      resultsTable = resultsTable.split(',');
      resultsTable.forEach(element => {
        const result = element.split('-');
        this.#results.push({time: result[0], id: result[1]});
      });
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