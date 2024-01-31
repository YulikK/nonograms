import "../scss/main.scss";
import mockFile from "../mock/mock.json";
import CrosswordModel from "./model/crossword.js";
import NanogramsPresenter from "./presenter/nanograms.js";

const siteBodyElement = document.body;

if (siteBodyElement !== null) {
  const crosswordModel = new CrosswordModel();

  const initData = (data) => {
    const crosswords = data.map(crosswordModel.adaptToClient);
    crosswordModel.setCrosswords(crosswords);
  };

  initData(mockFile);

  const nanogramsPresenter = new NanogramsPresenter(siteBodyElement, crosswordModel.getCrosswords());
  nanogramsPresenter.startGame();
}