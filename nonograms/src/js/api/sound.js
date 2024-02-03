import { FOLDER_SOUND, COMMAND, SOUNDS } from "../utils/const.js";
export default class Sound {
  #pathFolder = FOLDER_SOUND;
  #audio = new Audio();
  #soundsOnOff = true;

  soundsToggle() {
    this.#soundsOnOff = !this.#soundsOnOff;
  }

  playSound(event) {
    if (this.#soundsOnOff) {
      this.#audio.src = `${this.#pathFolder}${event}`;
      this.#audio.play();
    }
  }

  playSoundForCommand(command) {
    const event = command === COMMAND.CROSS ? SOUNDS.CROSS : SOUNDS.FILL;
    this.playSound(event);
  }
}
