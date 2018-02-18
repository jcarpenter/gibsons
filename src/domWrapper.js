import StyleSheets from './styleSheets';
import Config from './config';

export default class DomWrapper {
  constructor() {

    //get stylesheets
    this.styleSheets = new StyleSheets();

    //move html elements into a wrapper element
    this.domWrapper = document.createElement('div');
    this.domWrapper.id = 'domWrapper';
    this.domWrapper.style.width = String(Config.WEBVIEW_WIDTH * 1000) + 'px';
    this.domWrapper.style.height = String(Config.WEBVIEW_HEIGHT * 1000) + 'px';
    this.domWrapper.style.position = 'relative';
    this.domWrapper.style.overflow = 'scroll';
    this.domWrapper.style.borderRadius = '8px';
    this.domWrapper.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0.1)';
    this.domWrapper.style.transition = 'box-shadow 0.5s east-out'
    document.body.appendChild(this.domWrapper);

    // Move page elements into the domWrapper element
    while (document.body.children.length > 2) {
      let el = document.body.children[0];
      if (el.id != 'domWrapper' && el.id != 'container') {
        this.domWrapper.appendChild(document.body.children[0]);
      }
    }
   
    return this.domWrapper;
  }
}