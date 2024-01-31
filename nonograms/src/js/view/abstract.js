export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }
    this.structure = null;
    this.callback = {};
    
  }

  getElement() {
    return this.structure["element"];
  }

  removeElement() {
    this.structure = null;
    this.elements = null;
  }

}