import AbstractView from './abstract.js';
import { createElement } from '../utils/render.js';
import CrosswordModel from "../model/crossword.js";

export default class Results extends AbstractView {
  constructor(results, crosswords) {
    super();
    this._results = results;
    this._crosswords = new CrosswordModel();
    this._crosswords.setCrosswords(crosswords);
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
  }
  getStructure() {
    const node = {
      element: this._elements.resultsWrap,
      child: [
        {element: this._elements.titleWrap,
          child: [
            {element: this._elements.img}, 
            {element: this._elements.titleP}
          ]
        },
        
      ]
    };
    this._elements.results.forEach(elNode => {
      const newNode = {
        element: elNode.wrapInf,
        child: [
          {element: elNode.resultWrap,
            child: [{element: elNode.p}]},
          {element: elNode.level.wrap,
            child: Array.from({ length: Number(elNode.level.levelNumber) }, (el, i) => elNode.level[`star${i + 1}`])}
        ]};

      node.child.push(newNode);
    })
    
    return node;
  }
  getElementProperties() {
    const node = {
      resultsWrap: {tag: 'div', className: 'game__results results'},
      titleWrap:{tag: 'div', className: 'results__title-wrapper'},
      img: {tag: 'img',className: 'results__img',src: './img/icons/results.png',alt: 'Results table',width: '40',height: '40'},
      titleP: {tag: 'p', className: 'results__title', textContent: 'Results'},
      wrapInf: {tag: 'div', className: 'results__information-wrapper'},
      resultWrap: {tag: 'div', className: 'results__result-wrapper'},
      level: {
        wrap: {tag: 'div', className: 'results__level-wrapper'},
        star: {tag: 'img', className: 'results__level-img', src: './img/icons/level.png', alt: 'star level', width: '40', height: '40'}
      }
    }
    return node;
  }
  generateNode() {
    const node = {
      resultsWrap: createElement(this._tagsProperties.resultsWrap),
      titleWrap: createElement(this._tagsProperties.titleWrap),
      img: createElement(this._tagsProperties.img),
      titleP: createElement(this._tagsProperties.titleP),
      
      results: []
    };

    this._results.forEach(result => {
      const cross = this._crosswords.getElementById(result.id);
      const newResultNode = {
        wrapInf: createElement(this._tagsProperties.wrapInf),
        resultWrap: createElement(this._tagsProperties.resultWrap),
        p: createElement({tag: 'p', className: 'results__information', textContent: `${result.time} - ${cross.name}`}),
        level: {
          wrap: createElement(this._tagsProperties.level.wrap),
          levelNumber: cross.level
        }
      };

      for(let i = 1; i <= cross.level; i+=1) {
        newResultNode.level[`star${i}`] = createElement(this._tagsProperties.level.star);
      }
      node.results.push(newResultNode); 
      
    });
    return node;
  }
}