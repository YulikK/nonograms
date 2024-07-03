import { render } from "../utils/render.js";
import { STORE_NAME, SOUNDS } from "../utils/const.js";
import Store from "../api/store.js";
import ControlsView from "../view/controls.js";

export default class Controls {
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
      controls: new ControlsView(),
    };

    this.#store = new Store(STORE_NAME, window.localStorage);
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
      this.#sound.playSound(SOUNDS.SWITCH);
    };
    const onThemeClick = () => {
      this.#sound.playSound(SOUNDS.SWITCH);
      this.#gameContainer.classList.toggle("light-theme");
      this.#gameContainer.classList.toggle("dark-theme");
    };

    render(this.#gameContainer, this.#components["controls"]);

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
