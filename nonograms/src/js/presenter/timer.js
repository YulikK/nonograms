import { render } from "../utils/render.js";
import { RENDER_METHOD } from "../utils/const.js";
import { getTime } from "../utils/utils.js";
import TimerView from "../view/timer.js";

export default class Timer {
  #gameContainer;
  #components;
  #seconds;
  #isGameStart;
  #timer;

  constructor() {
    this.#seconds = 0;
    this.#timer = null;
    this.#isGameStart = false;
    this.#components = {
      timer: new TimerView()
    }
  }

  startGame(){
    this.#isGameStart = true;
  }
  stopGame() {
    this.#isGameStart = false;
  }

  setContainer(gameContainer){
    this.#gameContainer = gameContainer;
  }

  render() {
    render(this.#gameContainer, this.#components['timer'], RENDER_METHOD.PREPEND);
  }

  start() {
    if (!this.#timer) {
      this.#timer = setInterval(() => {
        if(!this.#isGameStart) this.reset();
        this.#seconds += 1;
        this.#components["timer"].updateTimerDisplay(this.#seconds);
      }, 1000);
    }
  }

  setSeconds(seconds) {
    this.#seconds = seconds;
    this.#components["timer"].updateTimerDisplay(this.#seconds);
  }
  getSeconds() {
    return this.#seconds;
  }
  getTime() {
    return getTime(this.#seconds);
  }
  reset() {
    if(this.#timer) clearInterval(this.#timer);
    this.#timer = null;
    this.#seconds = 0;
    this.#components["timer"].updateTimerDisplay(this.#seconds);
  }

}