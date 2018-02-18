import Model from './model';

// import { parseCssVar } from './utilities';

export default class Models {
  constructor(sceneFar, sceneNear, domWrapper, styleSheets) {

    // parse page
    // find models
    // get src attribute value
    // load model from that src
    // position world or window?
    // position 

    // turn on vr stylesheet so we can parse it's values. We'll turn it off at the end of this function.
    styleSheets.setVRSheet('enable');

    this.modelElements = domWrapper.getElementsByTagName('model');
    this.modelObjects = [];

    // if there are <model> elements in the HTML, create a three.js model instance for each.
    if (this.modelElements.length > 0) {

      for(var i = 0; i < this.modelElements.length; i++) {
        this.model = new Model(sceneFar, sceneNear, this.modelElements[i])
        this.modelObjects.push(this.model);
      }
    };

    // turn off the vr stylesheet. We don't want it active and adjusting layout until we're in VR mode.
    styleSheets.setVRSheet('disable');
  }

  hide() {
    this.modelObjects.forEach((e) => {
      e.hide();
    })
  }

  show() {
    this.modelObjects.forEach((e) => {
      e.show();
    })
  }

}