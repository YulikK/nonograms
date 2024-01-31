export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  saveResult(results) {
    this._storage.setItem(
      `${this._storeKey}-result-table`,
      results.map(el => `${el.time}-${el.id}`),
    );
  }
  
  saveGame(saveGame) {
    const answers = saveGame.answers.join('-');
    this._storage.setItem(
      `${this._storeKey}-save-game`, `${saveGame.crossword.id}:${saveGame.seconds}:${answers}`);
  }

  getItem(additionalKey) {
    try {
      return this._storage.getItem(`${this._storeKey}-${additionalKey}`);
    } catch (err) {
      return {};
    }
  }

}
