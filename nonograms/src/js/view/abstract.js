export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }
    this._structure = null;
    this._callback = {};
  }

  getElement() {
    return this._structure["element"];
  }

  removeElement() {
    this.element = null;
  }
}