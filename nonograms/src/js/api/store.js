export default class Store {
  #storage;
  #storeKey;

  constructor(key, storage) {
    this.#storage = storage;
    this.#storeKey = key;
  }

  saveResult(results) {
    this.#storage.setItem(
      `${this.#storeKey}-result-table`,
      results.map((el) => `${el.time}-${el.id}`),
    );
  }

  saveGame(saveGame) {
    const answers = saveGame.answers.join("-");
    this.#storage.setItem(
      `${this.#storeKey}-save-game`,
      `${saveGame.crossword.id}:${saveGame.seconds}:${answers}`,
    );
  }

  getItem(additionalKey) {
    try {
      return this.#storage.getItem(`${this.#storeKey}-${additionalKey}`);
    } catch (err) {
      return null;
    }
  }
}
