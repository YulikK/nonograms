import "./scss/main.scss";
import mockFile from "./mock/mock.json";
import CrosswordModel from "./js/model/crossword.js";
import NanogramsPresenter from "./js/presenter/nanograms.js";

const siteBodyElement = document.body;

if (siteBodyElement !== null) {
  const crosswordModel = new CrosswordModel();
  const crosswords = mockFile.map(crosswordModel.adaptToClient);
  crosswordModel.setCrosswords(crosswords);

  const nanogramsPresenter = new NanogramsPresenter(
    siteBodyElement,
    crosswordModel.getCrosswords(),
  );

  const props = { isReset: true, isFirstStart: true };
  nanogramsPresenter.startGame(props);
}
