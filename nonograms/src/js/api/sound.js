import { COMMAND, FOLDER_SOUND } from "../utils/const.js";
export default class Sound {
  constructor() {
    this._pathFolder = FOLDER_SOUND;
    this._audio = new Audio();
    this._soundsOnOff = true;
  }

  _soundsOn() {
    this._soundsOnOff = true;
  }

  _soundsOff() {
    this._soundsOnOff = false;
  }

  soundsToggle() {
    if (this._soundsOnOff) this._soundsOff();
    else this._soundsOn();
  }

  async playSound(event) {
    if(this._soundsOnOff) {
      
      this._audio.src = `${this._pathFolder}${event}`;
      // this._audio.play();

      return this._audio.play();
      // if (playPromise !== undefined) {
      //   playPromise.then(() => {
          
      //   })
    }
  }
}