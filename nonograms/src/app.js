import "./scss/main.scss";
import mockFile from "./mock/mock.json";
import CrosswordModel from "./js/model/crossword.js";
import NanogramsPresenter from "./js/presenter/nanograms.js";
import GalleryPresenter from "./js/presenter/gallery.js";
import WinPresenter from "./js/presenter/win.js";

const siteBodyElement = document.body;

if (siteBodyElement !== null) {
  const crosswordModel = new CrosswordModel();
  const crosswords = mockFile.map(crosswordModel.adaptToClient);
  crosswordModel.setCrosswords(crosswords);

  const winPresenter = new WinPresenter(siteBodyElement);
  const galleryPresenter = new GalleryPresenter(
    siteBodyElement,
    crosswordModel.getCrosswords(),
  );
  const nanogramsPresenter = new NanogramsPresenter(
    siteBodyElement,
    crosswordModel.getCrosswords(),
    galleryPresenter,
    winPresenter,
  );

  const props = { isReset: true, isFirstStart: true };
  nanogramsPresenter.startGame(props);
}
