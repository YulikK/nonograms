export const COMMAND = {
  FILL: "fill",
  EMPTY: "empty",
  CROSS: "cross",
};
const STORE_PREFIX = `nanograms`;
const STORE_VER = `v1`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const RENDER_METHOD = {
  APPEND: "append",
  PREPEND: "prepend",
};

export const FOLDER_SOUND = "./sound/";
export const SOUNDS = {
  FILL: "click.mp3",
  CROSS: "click-context.mp3",
  RENDER: "random.mp3",
  REFRESH: "refresh.mp3",
  ANSWERS: "show-answers.mp3",
  SWITCH: "switch.mp3",
  WIN: "win.mp3",
};
