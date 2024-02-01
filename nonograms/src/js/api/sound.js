import { FOLDER_SOUND } from "../utils/const.js";
export default class Sound {
  #pathFolder = FOLDER_SOUND;
  #audio = new Audio();
  #soundsOnOff = true;

  #soundsOn() {
    this.#soundsOnOff = true;
  }

  #soundsOff() {
    this.#soundsOnOff = false;
  }

  soundsToggle() {
    if (this.#soundsOnOff) this.#soundsOff();
    else this.#soundsOn();
  }

  async playSound(event) {
    if (this.#soundsOnOff) {
      this.#audio.src = `${this.#pathFolder}${event}`;
      return this.#audio.play();
    }
  }
}
