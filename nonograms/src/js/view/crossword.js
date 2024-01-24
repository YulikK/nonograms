import AbstractView from './abstract.js';
import { createElement } from '../utils/render.js';
import { COMMAND } from '../utils/const.js';

export default class Crossword extends AbstractView {
  constructor(crossword) {
    super();
    this._crossword = crossword.playTable;
    this._isGameStop = false;
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._cellClickHandler = this._cellClickHandler.bind(this);
    this._cellClickContextHandler = this._cellClickContextHandler.bind(this);
  }
  getStructure() {
    const node = {
      element: this._elements.table,
      child: []};
    
    this._elements.rows.forEach(rowEl => {
      const tdCells = [];
      rowEl.cells.forEach(cellEl => {
        tdCells.push({element: cellEl.td});
      });

      node.child.push({
        element: rowEl.tr,
        child: tdCells
      });
      
    })
    
    return node;
  }

  generateNode() {
    const hint = this.generateHint(this._crossword);

    const node = {
      table: createElement({tag: 'table', className: 'game__crossword crossword'}),
      rows: []
    }

    for (let i = 0; i < hint.maxV; i += 1) {
      node.rows.push({
        tr: createElement({tag: 'tr'}),
        cells: []
      });

      for (let j = 0; j < hint.maxH; j += 1) {
        node.rows[i].cells.push({
          td: createElement({tag: 'td', className: 'empty'})
        })
      }

      for (let j = 0; j < hint.vertical.length; j += 1) {
        node.rows[i].cells.push({
          td: createElement({tag: 'td', className: 'cell hint', textContent: hint.vertical[j][i] ? hint.vertical[j][i] : ''})
        })
      }
    }

    for(let i = 0; i < this._crossword.length; i += 1) {
      node.rows.push({
        tr: createElement({tag: 'tr'}),
        cells: []
      });
      for (let j = 0; j < hint.maxH; j += 1) {
        node.rows[i + hint.maxV].cells.push({
          td: createElement({tag: 'td', className: 'cell hint', textContent: hint.horizontal[i][j] ? hint.horizontal[i][j] : ''})
        })
      }
      for (let j = 0; j < this._crossword.length; j += 1) {
        node.rows[i + hint.maxV].cells.push({
          td: createElement({tag: 'td', className: `cell`, data: `el-${i}-${j}`})
        })
      }
    }

    return node;

  }
  
  generateHint(crossword) {
    const rows = crossword.length;
    const cols = crossword[0].length;

    const horizontal = [];
    const vertical = [];

    for (let i = 0; i < rows; i += 1) {
      let consistency = 0;
      const rowHints = [];
      for(let j = 0; j < cols; j += 1) {
        if(crossword[i][j] === "1") consistency += 1;
        if(crossword[i][j] === "0" && consistency > 0) {
          rowHints.push(consistency);
          consistency = 0;
        }
      }
      if(consistency > 0) {
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

    const alignedHorizontalHints = horizontal.map(row => {
      const emptyEl = Array(maxHorizontalLength - row.length).fill(0);
      return emptyEl.concat(row);
    });

    const alignedVerticalHints = vertical.map(cell => {
      const emptyEl = Array(maxVerticalLength - cell.length).fill(0);
      return emptyEl.concat(cell);
    });

    return {
      maxH: maxHorizontalLength,
      maxV: maxVerticalLength,
      horizontal: alignedHorizontalHints,
      vertical: alignedVerticalHints,
    }
  }

  _cellClickHandler(evt) {
    if (this._isGameStop) {
      return;
    }
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("hint--off")) evt.target.classList.remove("hint--off");
      else evt.target.classList.add("hint--off")
    } else {
      let command = '';
      if (evt.target.classList.contains("cross")) evt.target.classList.remove("cross");
      if (evt.target.classList.contains("fill")) {
        evt.target.classList.remove("fill");
        command = COMMAND.EMPTY;
      }
      else {
        evt.target.classList.add("fill");
        command = COMMAND.FILL;
      }

      const indexEl = this._getIndex(evt.target.data);
      this._callback.cellClick(indexEl, command);
    }

    evt.preventDefault();
    
  }

  _cellClickContextHandler(evt) {
    if (this._isGameStop) {
      return;
    }
    evt.preventDefault();
    if (!evt.target.classList.contains("cell")) {
      return;
    }
    if (!evt.target.classList.contains("hint")) {
      if (evt.target.classList.contains("fill")) evt.target.classList.remove("fill");

      let command = '';
      if (evt.target.classList.contains("cross")) {
        evt.target.classList.remove("cross");
        command = COMMAND.EMPTY
      } else {
        evt.target.classList.add("cross");
        command = COMMAND.CROSS;
      }

      const indexEl = this._getIndex(evt.target.data);
      this._callback.cellClick(indexEl, command);
    }
  }

  _getIndex(data) {
    const indexArr = data.split('-');
    const index = {
      i: indexArr[1],
      j: indexArr[2]
    }
    return index;
  }

  stopGame() {
    this._isGameStop = true;
  }
  startGame() {
    this._isGameStop = false;
  }

  loadGame(crossword, answers){
    this._crossword = crossword.playTable;
    this.setAnswersCrossword(answers);

  }
  setClearCrossword() {
    this._elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove('fill', 'cross', 'hint--off')
      })
    })
  }

  setAnswersCrossword(answer) {
    this._elements.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        cell.td.classList.remove('fill', 'cross', 'hint--off')
        if(!(cell.td.classList.contains('empty') || cell.td.classList.contains('hint'))) {
          const index = this._getIndex(cell.td.data);
          switch (answer[index.i][index.j]){
            case '1':
              cell.td.classList.add("fill");
              break;
            case '0':
              cell.td.classList.add("cross");
              break;
          }
          // if (answer[index.i][index.j] === '1') cell.td.classList.add("fill");
        }
      })
    })
  }

  setCellClickHandler(callback) {
    this._callback.cellClick = callback;
    this.getElement().addEventListener(`click`, this._cellClickHandler);
    this.getElement().addEventListener(`contextmenu`, this._cellClickContextHandler);
  }

  deleteCellClickHandler() {
    this.getElement().removeEventListener(`click`, this._cellClickHandler);
  }
}