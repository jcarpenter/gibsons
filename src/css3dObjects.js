import Css3dObject from './css3dObject';

import {
  // toggleWebGLVisibility,
  // toggleCSSVisibility,
  // toggleWebviewShadows,
  // metersToPx,
  // getTransform,
  // parseMatrix,
  parseCssVar,
  // parseCssUrl
} from './utilities';

export default class Css3dObjects {
  constructor(cssRoot, webview, domWrapper, styleSheets) {

    // turn on vr stylesheet so we can parse it's values. We'll turn it off at the end of this function.
    styleSheets.setVRSheet('enable');
    
    this.allElements = [];
    this.stereoElements = [];

    // `domWrapper.getElementsByTagName('*')` returns all elements inside domWrapper
    for (var i = 0; i < domWrapper.getElementsByTagName('*').length; i++) {
      this.allElements.push(domWrapper.getElementsByTagName('*')[i]);
    }

    // find elements that have both --transform-style 'stereo' and a transform, and create Css3dObject instances from them.
    for (var i = 0; i < this.allElements.length; i++) {

      this.element = this.allElements[i];
      this.transformStyle = parseCssVar(this.element, '--transform-style');
      this.transform =  parseCssVar(this.element, 'transform');

      // It's not enough to check for --transform-style: stereo, because we get false positives on children, which inherit it from parent.
      // We can get the precision we need by also checking if they have transforms.
      // TODO: This is obviously error prone, since some elements that are children of a 'stereo' parent could indeed have transforms, but it works for now.
      if(this.transformStyle == 'stereo' && this.transform !== 'none') {

        // for each element that matches the criteria, create a css3dObject instance and push it to the stereoElements array.
        this.css3dObject = new Css3dObject(cssRoot, webview, this.element);
        this.stereoElements.push(this.css3dObject);
      }
    }

    // turn off the vr stylesheet. We don't want it active and adjusting layout until we're in VR mode.
    styleSheets.setVRSheet('disable');
  }

  // for each css3dObject instance in stereoElements array, call it's animate function
  // 'mode' is either 'hide' or 'show'.
  animate(mode, duration) {

    this.stereoElements.forEach((e) => {
      e.animate(mode, duration);
    })
  }
}