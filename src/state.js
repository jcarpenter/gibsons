export default class State {
  constructor(styleSheets, stereoElements, siteBackground, webview) {
    this.currentDisplayMode;
    this.styleSheets = styleSheets;
    this.stereoElements = stereoElements;
    this.siteBackground = siteBackground;
    this.webview = webview;
  }

  setDisplayMode(targetMode) {
    if (targetMode == 'mobile' && this.currentDisplayMode != 'mobile') {

      this.webview.showShadows();
      this.siteBackground.show();
      this.stereoElements.animate('hide');
      this.styleSheets.setVRSheet('disable');
      this.currentDisplayMode = targetMode;

    } else if ( targetMode == 'vr-fullscreen' && this.currentDisplayMode != 'vr-fullscreen') {

      this.webview.hideShadows();
      this.siteBackground.hide();
      this.stereoElements.animate('show');
      this.styleSheets.setVRSheet('enable');
      this.currentDisplayMode = targetMode;

    } else if (targetMode == 'vr-windowed' && this.currentDisplayMode != 'vr-windowed') {

      // TODO: 'vr-windowed' mode is complicated. We want to keep the vr stylesheet disabled. But we also want to return the CSS3DObjects to their original positions, without hiding them.
      
      this.currentDisplayMode = targetMode;
    
    } else {
      console.log("ignored");
    }
  }
}