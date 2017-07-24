import Config from './config';
import { metersToPx } from './utilities';

export default class WebView {
  constructor(cssRoot, domWrapper) {

    // Turn the domWrapper into a CSS3DObject and set position
    this.object = new THREE.CSS3DObject(domWrapper);
    this.object.position.z = metersToPx(-Config.WEBVIEW_DISTANCE);
    this.object.scale.set(Config.WEBVIEW_DISTANCE, Config.WEBVIEW_DISTANCE, Config.WEBVIEW_DISTANCE);

    cssRoot.add(this.object);
  }

  hideShadows() {
    domWrapper.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0)'; 
    // new TWEEN.Tween(webviewShadow.material)
    //   .to({opacity: 0}, 500)
    //   .start();
  }

  showShadows() {
    domWrapper.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0)'; 
    // new TWEEN.Tween(webviewShadow.material)
    //   .to({opacity: 0}, 500)
    //   .start();
  }
}