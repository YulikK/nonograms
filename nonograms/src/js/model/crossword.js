export default class Crossword {
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