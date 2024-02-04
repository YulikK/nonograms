import AbstractView from "./abstract.js";
import { createElement } from "../utils/render.js";
import { COMMAND } from "../utils/const.js";

export default class Crossword extends AbstractView {
  #crossword;
  #isGameStop;

  constructor(crossword) {
    super();
    this.#crossword = crossword.playTable;
    this.#isGameStop = false;
    this.elements = this.#generateNode();
    this.structure = this.#getStructure();
  }

  stopGame() {
    this.#isGameStop = true;
  }
  startGame() {
    this.#isGameStop = false;
  }

  loadGame(crossword, answers) {
    this.#crossword = crossword.playTable;
    this.setAnswersCrossword(answers);
  }
  setClearCrossword() {
    this.elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove("fill", "cross", "hint--off");
      });
    });
  }

  setAnswersCrossword(answer) {
    this.elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove("fill", "cross", "hint--off");
        if (
          !(
            cell.td.classList.contains("empty") ||
            cell.td.classList.contains("hint")
          )
        ) {
          const index = this.#getIndex(cell.td.data);
          switch (answer[index.i][index.j]) {
            case "1":
              cell.td.classList.add("fill");
              break;
            case "0":
              cell.td.classList.add("cross");
              break;
          }
        }
      });
    });
  }

  setCellClickHandler(callback) {
    this.callback.cellClick = callback;
    this.getElement().addEventListener(`click`, this.#cellClickHandler);
    this.getElement().addEventListener(
      `contextmenu`,
      this.#cellClickContextHandler,
    );
    return this;
  }
  #getStructure() {
    const node = {
      element: this.elements.table,
      child: [],
    };

    this.elements.rows.forEach((rowEl) => {
      const tdCells = [];
      rowEl.cells.forEach((cellEl) => {
        tdCells.push({ element: cellEl.td });
      });

      node.child.push({
        element: rowEl.tr,
        child: tdCells,
      });
    });

    return node;
  }

  #generateNode() {
    const hint = this.#generateHint(this.#crossword);

    const node = {
      table: createElement({
        tag: "table",
        className: "game__crossword crossword",
      }),
      rows: [],
    };

    let borderCounterTopBottom = 1;
    for (let i = 0; i < hint.maxV; i += 1) {
      const borderClassTop = borderCounterTopBottom === 1 ? "border-top" : "";
      const borderClassBottom = i === hint.maxV - 1 ? "border-bottom" : "";
      node.rows.push({
        tr: createElement({ tag: "tr", className: `row` }),
        cells: [],
      });

      for (let j = 0; j < hint.maxH; j += 1) {
        node.rows[i].cells.push({
          td: createElement({ tag: "td", className: "empty" }),
        });
      }

      let borderCounterLeftRight = 1;
      for (let j = 0; j < hint.vertical.length; j += 1) {
        const borderClassLeft =
          borderCounterLeftRight === 1 ? "border-left" : "";
        const borderClassRight =
          borderCounterLeftRight === 5 || j === hint.vertical.length - 1
            ? "border-right"
            : "";
        node.rows[i].cells.push({
          td: createElement({
            tag: "td",
            className: `cell hint ${borderClassTop} ${borderClassBottom} ${borderClassLeft} ${borderClassRight}`,
            textContent: hint.vertical[j][i] ? hint.vertical[j][i] : "",
          }),
        });
        borderCounterLeftRight += 1;
        if (borderCounterLeftRight === 6) borderCounterLeftRight = 1;
      }
      borderCounterTopBottom += 1;
    }

    let borderCounterRow = 1;
    for (let i = 0; i < this.#crossword.length; i += 1) {
      const borderClassTop = borderCounterRow === 1 ? "border-top" : "";
      const borderClassBottom =
        borderCounterRow === 5 || i === this.#crossword.length - 1
          ? "border-bottom"
          : "";
      node.rows.push({
        tr: createElement({ tag: "tr", className: "row" }),
        cells: [],
      });
      for (let j = 0; j < hint.maxH; j += 1) {
        const borderClassLeft = j === 0 ? "border-left" : "";
        const borderClassRight = j === hint.maxH - 1 ? "border-right" : "";
        node.rows[i + hint.maxV].cells.push({
          td: createElement({
            tag: "td",
            className: `cell hint ${borderClassRight} ${borderClassLeft} ${borderClassTop} ${borderClassBottom}`,
            textContent: hint.horizontal[i][j] ? hint.horizontal[i][j] : "",
          }),
        });
      }
      let borderCounterCell = 1;
      for (let j = 0; j < this.#crossword.length; j += 1) {
        const borderClassCell =
          borderCounterCell === 5 || j === this.#crossword.length - 1
            ? "border-right"
            : "";
        const borderClassRow =
          borderCounterRow === 5 || i === this.#crossword.length - 1
            ? "border-bottom"
            : "";
        node.rows[i + hint.maxV].cells.push({
          td: createElement({
            tag: "td",
            className: `cell ${borderClassCell} ${borderClassRow} ${borderClassBottom}`,
            data: `el-${i}-${j}`,
          }),
        });
        borderCounterCell += 1;
        if (borderCounterCell === 6) borderCounterCell = 1;
      }
      borderCounterRow += 1;
      if (borderCounterRow === 6) borderCounterRow = 1;
    }

    return node;
  }

  #generateHint(crossword) {
    const rows = crossword.length;
    const cols = crossword[0].length;

    const horizontal = [];
    const vertical = [];

    for (let i = 0; i < rows; i += 1) {
      let consistency = 0;
      const rowHints = [];
      for (let j = 0; j < cols; j += 1) {
        if (crossword[i][j] === "1") consistency += 1;
        if (crossword[i][j] === "0" && consistency > 0) {
          rowHints.push(consistency);
          consistency = 0;
        }
      }
      if (consistency > 0) {
        rowHints.push(consistency);
      }
      horizontal.push(rowHints);
    }

    for (let j = 0; j < cols; j += 1) {
      let consistency = 0;
      const colHints = [];

      for (let i = 0; i < rows; i += 1) {
        if (crossword[i][j] === "1") {
          consistency += 1;
        } else if (consistency > 0) {
          colHints.push(consistency);
          consistency = 0;
        }
      }

      if (consistency > 0) {
        colHints.push(consistency);
      }

      vertical.push(colHints);
    }

    const maxHorizontalLength = horizontal.reduce((max, row) => {
      return Math.max(max, row.length);
    }, 0);
    const maxVerticalLength = vertical.reduce((max, col) => {
      return Math.max(max, col.length);
    }, 0);

    const alignedHorizontalHints = horizontal.map((row) => {
      const emptyEl = Array(maxHorizontalLength - row.length).fill(0);
      return emptyEl.concat(row);
    });

    const alignedVerticalHints = vertical.map((cell) => {
      const emptyEl = Array(maxVerticalLength - cell.length).fill(0);
      return emptyEl.concat(cell);
    });

    return {
      maxH: maxHorizontalLength,
      maxV: maxVerticalLength,
      horizontal: alignedHorizontalHints,
      vertical: alignedVerticalHints,
    };
  }

  #cellClickHandler = (evt) => {
    if (this.#isGameStop) {
      return;
    }
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("hint--off"))
        evt.target.classList.remove("hint--off");
      else evt.target.classList.add("hint--off");
    } else {
      let command = "";
      if (evt.target.classList.contains("cross"))
        evt.target.classList.remove("cross");
      if (evt.target.classList.contains("fill")) {
        evt.target.classList.remove("fill");
        command = COMMAND.EMPTY;
      } else {
        evt.target.classList.add("fill");
        command = COMMAND.FILL;
      }

      const indexEl = this.#getIndex(evt.target.data);
      this.callback.cellClick(indexEl, command);
    }

    evt.preventDefault();
  };

  #cellClickContextHandler = (evt) => {
    if (this.#isGameStop) {
      return;
    }
    evt.preventDefault();
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (!evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("fill"))
        evt.target.classList.remove("fill");

      let command = "";
      if (evt.target.classList.contains("cross")) {
        evt.target.classList.remove("cross");
        command = COMMAND.EMPTY;
      } else {
        evt.target.classList.add("cross");
        command = COMMAND.CROSS;
      }

      const indexEl = this.#getIndex(evt.target.data);
      this.callback.cellClick(indexEl, command);
    }
  };

  #getIndex(data) {
    const indexArr = data.split("-");
    const index = {
      i: indexArr[1],
      j: indexArr[2],
    };
    return index;
  }
}
