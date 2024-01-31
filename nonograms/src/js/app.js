import "../scss/main.scss";
import mockFile from "../mock/mock.json";
import CrosswordModel from "./model/crossword.js";
import NanogramsPresenter from "./presenter/nanograms.js";
import GalleryPresenter from "./presenter/gallery.js";
import WinPresenter from "./presenter/win.js";

const siteBodyElement = document.body;

if (siteBodyElement !== null) {
  const crosswordModel = new CrosswordModel();

  const initData = (data) => {
    const crosswords = data.map(crosswordModel.adaptToClient);
    crosswordModel.setCrosswords(crosswords);
  };

  initData(mockFile);

  const winPresenter = new WinPresenter(siteBodyElement);
  const galleryPresenter = new GalleryPresenter(siteBodyElement, crosswordModel.getCrosswords());
  const nanogramsPresenter = new NanogramsPresenter(siteBodyElement, crosswordModel.getCrosswords(), galleryPresenter, winPresenter);
  
  nanogramsPresenter.startGame();
}