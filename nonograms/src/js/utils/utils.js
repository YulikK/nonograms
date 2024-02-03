import { COMMAND } from "../utils/const.js";
export function deepCopy(matrix) {
  return matrix.map((row) =>
    row.map((cell) => (typeof cell === "object" ? deepCopy(cell) : cell)),
  );
}

export function getClearMatrix(lengthMatrix) {
  return Array.from({ length: lengthMatrix }, () =>
    Array(lengthMatrix).fill(""),
  );
}

export function compareMatrix(matrix1, matrix2) {
  const answers = matrix1.map((row) =>
    row.map((cell) => (cell === "0" ? "" : cell)),
  );
  const playTable = matrix2.map((row) =>
    row.map((cell) => (cell === "0" ? "" : cell)),
  );
  return JSON.stringify(answers) === JSON.stringify(playTable);
}

export function getTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export function setAnswer(command) {
  let answer;
  switch (command) {
    case COMMAND.FILL:
      answer = "1";
      break;
    case COMMAND.EMPTY:
      answer = "";
      break;
    case COMMAND.CROSS:
      answer = "0";
      break;
  }
  return answer;
}
