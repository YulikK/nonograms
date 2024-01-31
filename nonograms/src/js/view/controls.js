import AbstractView from './abstract.js';
import { createElement } from '../utils/render.js';

export default class Controls extends AbstractView {
  constructor() {
    super();
    this._tagsProperties = this.getElementProperties();
    this._elements = this.generateNode();
    this._structure = this.getStructure();
    this._refreshClickHandler = this._refreshClickHandler.bind(this);
    this._showAnswersClickHandler = this._showAnswersClickHandler.bind(this);
    this._saveClickHandler = this._saveClickHandler.bind(this);
    this._loadClickHandler = this._loadClickHandler.bind(this);
    this._themeClickHandler = this._themeClickHandler.bind(this);
    this._soundClickHandler = this._soundClickHandler.bind(this);
  }
  getStructure() {
    return {
      element: this._elements.header,
      child: [
        {element: this._elements.h1},
        {element: this._elements.options.wrap,
        child:[
          {element: this._elements.options.timer.wrap,
          child: [
            {element: this._elements.options.timer.imgWrap,
            child: [
              {element: this._elements.options.timer.img}
            ]},
            {element: this._elements.options.timer.timeWrap,
            child: [
              {element: this._elements.options.timer.time}
            ]}
          ]},
          {element: this._elements.options.refresh.a,
          child: [
            {element: this._elements.options.refresh.img}
          ]},
          {element: this._elements.options.showAnswer.a,
          child: [
            {element: this._elements.options.showAnswer.img}
          ]},
          {element: this._elements.options.saveLoad.wrap,
            child: [
              {element: this._elements.options.saveLoad.save,
                child: [{ element:this._elements.options.saveLoad.saveImg}]},
              {element: this._elements.options.saveLoad.load,
                child: [{element: this._elements.options.saveLoad.loadImg}]}
              ]}
        ]},
        {element: this._elements.settings.wrap,
        child: [
          {element: this._elements.settings.sound.label,
            child: [
              {element: this._elements.settings.sound.input},
              {element: this._elements.settings.sound.span},
          ]},
          {element: this._elements.settings.theme.label,
          child: [
            {element: this._elements.settings.theme.input},
            {element: this._elements.settings.theme.span},
          ]}
        ]},
      ],
    };
  }
  getElementProperties() {
    return {
      header: { tag: 'header', className: 'game__control control' },
      h1: { tag: 'h1', textContent: 'Nanograms game', className: 'visually-hidden' },
      options: {
        wrap: { tag: 'div', className: 'control__options options' },
        timer: {
          wrap: { tag: 'div', className: 'options__timer timer' },
          imgWrap: { tag: 'div', className: 'timer__img-wrapper' },
          img: { tag: 'img', className: 'timer__img', src: './img/icons/timer.png', alt: 'timer', width: '40', height: '40' },
          timeWrap: { tag: 'div', className: 'timer__time-wrapper' },
          time: { tag: 'p', className: 'timer__time', textContent: '0:00' }
        },
        refresh: {
          a: { tag: 'a', className: 'options__refresh', href: '' },
          img: { tag: 'img', className: 'options__refresh-img', src: './img/icons/refresh.png', alt: 'refresh', width: '40', height: '40' }
        },
        showAnswer: {
          a: { tag: 'a', className: 'options__show-answer', href: '' },
          img: { tag: 'img', className: 'options__show-answer-img', src: './img/icons/show-answers.png', alt: 'show-answer', width: '40', height: '40' }
        },
        saveLoad: {
          wrap: { tag: 'div', className: 'options__save-load' },
          save: { tag: 'a', className: 'options__save disable', href: ''},
          saveImg: { tag: 'img', className: 'options__save-img', src: './img/icons/save.png', alt: 'save game', width: '40', height: '40' },
          load: { tag: 'a', className: 'options__load disable', href: ''},
          loadImg: { tag: 'img', className: 'options__load-img', src: './img/icons/open.png', alt: 'load last game', width: '40', height: '40' },
        },
      },
      settings: {
        wrap: { tag: 'div', className: 'control__settings settings' },
        sound: {
          label: { tag: 'label', id: 'switch-sound', className: 'settings__sound sound' },
          input: { tag: 'input', className: 'sound__input', type: 'checkbox', id: 'slider-sound' },
          span: { tag: 'span', className: 'sound__slider round' }
        },
        theme: {
          label: { tag: 'label', id: 'switch-theme', className: 'settings__theme theme' },
          input: { tag: 'input', className: 'theme__input', type: 'checkbox', id: 'slider-theme' },
          span: { tag: 'span', className: 'theme__slider round' }
        }
      }
    }
  }
  generateNode() {
    return {
      header: createElement(this._tagsProperties.header),
      h1: createElement(this._tagsProperties.h1),
      options: {
        wrap: createElement(this._tagsProperties.options.wrap),
        timer: {
          wrap: createElement(this._tagsProperties.options.timer.wrap),
          imgWrap: createElement(this._tagsProperties.options.timer.imgWrap),
          img: createElement(this._tagsProperties.options.timer.img),
          timeWrap: createElement(this._tagsProperties.options.timer.timeWrap),
          time: createElement(this._tagsProperties.options.timer.time),
        },
        refresh: {
          a: createElement(this._tagsProperties.options.refresh.a),
          img: createElement(this._tagsProperties.options.refresh.img),
        },
        showAnswer: {
          a: createElement(this._tagsProperties.options.showAnswer.a),
          img: createElement(this._tagsProperties.options.showAnswer.img),
        },
        saveLoad: {
          wrap: createElement(this._tagsProperties.options.saveLoad.wrap),
          save: createElement(this._tagsProperties.options.saveLoad.save),
          saveImg: createElement(this._tagsProperties.options.saveLoad.saveImg),
          load: createElement(this._tagsProperties.options.saveLoad.load),
          loadImg: createElement(this._tagsProperties.options.saveLoad.loadImg),
        },
      },
      settings: {
        wrap: createElement(this._tagsProperties.settings.wrap),
        sound: {
          label: createElement(this._tagsProperties.settings.sound.label),
          input: createElement(this._tagsProperties.settings.sound.input),
          span: createElement(this._tagsProperties.settings.sound.span)
        },
        theme: {
          label: createElement(this._tagsProperties.settings.theme.label),
          input: createElement(this._tagsProperties.settings.theme.input),
          span: createElement(this._tagsProperties.settings.theme.span)
        }
      }
    };
  }

  updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    this._elements.options.timer.time.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  setSaveEnabled(){
    this._elements.options.saveLoad.save.classList.remove('disable');
  }
  setLoadEnable() {
    this._elements.options.saveLoad.load.classList.remove('disable');
  }

  _refreshClickHandler(evt) {
    evt.preventDefault();
    this._callback.refreshClick();
  }

  _showAnswersClickHandler(evt) {
    evt.preventDefault();
    this._callback.showAnswers();
  }

  _saveClickHandler(evt) {
    evt.preventDefault();
    this._callback.saveClick();
  }
  _loadClickHandler(evt) {
    evt.preventDefault();
    this._callback.loveClick();
  }
  _themeClickHandler(evt) {
    this._callback.themeClick();
  }
  _soundClickHandler(evt) {
    this._callback.soundClick();
  }

  setRefreshClickHandler(callback) {
    this._callback.refreshClick = callback;
    this._elements.options.refresh.a.addEventListener(`click`, this._refreshClickHandler);
  }

  setShowAnswersClickHandler(callback) {
    this._callback.showAnswers = callback;
    this._elements.options.showAnswer.a.addEventListener(`click`, this._showAnswersClickHandler);
  }

  setSaveClickHandler(callback) {
    this._callback.saveClick = callback;
    this._elements.options.saveLoad.save.addEventListener(`click`, this._saveClickHandler);
  }

  setLoadClickHandler(callback) {
    this._callback.loveClick = callback;
    this._elements.options.saveLoad.load.addEventListener(`click`, this._loadClickHandler);
  }
  setThemeClickHandler(callback) {
    this._callback.themeClick = callback;
    this._elements.settings.theme.input.addEventListener(`click`, this._themeClickHandler);
  }
  setSoundClickHandler(callback) {
    this._callback.soundClick = callback;
    this._elements.settings.sound.input.addEventListener(`click`, this._soundClickHandler);
  }
}