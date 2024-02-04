import { STORE_SAVE, STORE_RESULTS } from "../utils/const";
export default class Store {
  #storage;
  #storeKey;

  constructor(key, storage) {
    this.#storage = storage;
    this.#storeKey = key;
  }

  saveResult(results) {
    this.#storage.setItem(
      `${this.#storeKey}-${STORE_RESULTS}`,
      JSON.stringify(results),
    );
  }

  saveGame(saveGame) {
    this.#storage.setItem(
      `${this.#storeKey}-${STORE_SAVE}`,
      JSON.stringify(saveGame),
    );
  }

  getResult() {
    return this.#getItem(STORE_RESULTS);
  }

  getSave() {
    return this.#getItem(STORE_SAVE);
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
