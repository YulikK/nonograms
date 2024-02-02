export default class Crossword {
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

  getElementById(id) {
    let index = 0;
    let currentEl = this.#crosswords[index];
    while (currentEl.id !== id) {
      index += 1;
      if (index > this.#crosswords.length - 1) break;
      currentEl = this.#crosswords[index];
    }

    return currentEl;
  }

  #getRandomCrossword(current, isFirstStart) {
    let newCrossword = this.#getNextCrossword();
    while (current === newCrossword || (isFirstStart && newCrossword.level != 1)) {
      newCrossword = this.#getNextCrossword();
    }
    return newCrossword;
  }

  getNewCrossword(newCrossword, currentCrossword, isFirstStart = false) {
    if (newCrossword) return newCrossword;
    else return this.#getRandomCrossword(currentCrossword, isFirstStart);
  }

  #getNextCrossword() {
    return this.#crosswords[
      Math.floor(Math.random() * this.#crosswords.length)
    ];
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
}
