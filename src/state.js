export default class State {
  constructor(styleSheets, stereoElements, siteBackground, grid, webview, environment, models) {
    
    this.styleSheets = styleSheets;
    this.stereoElements = stereoElements;
    this.siteBackground = siteBackground;
    this.grid = grid;
    this.webview = webview;
    this.environment = environment;
    this.models = models;

    // variable for current display mode
    this.currentDisplayMode;

    // set up demo mode. 
    // demo mode is used to turn features on one by one, to help show how they work.
    this.demoMode = {};
    this.demoMode.enabled = false;
    this.demoMode.steps = [
      'Disable all',
      'Show site background',
      'Show window transparency',
      'Show window relative transforms',
      'Show environment',
      'Show window relative models',
      'Show world relative transforms and models'
    ]
    this.demoMode.currentStep = 0;

  }

  // handle display mode updates
  setDisplayMode(targetMode) {

    if (targetMode == 'mobile' && this.currentDisplayMode !== 'mobile') {

      this.enableMobileMode();

    } else if ( targetMode == 'vr-fullscreen' && this.demoMode.enabled == false) {

      this.enableVrFullscreenMode();      

    } else if ( targetMode == 'vr-fullscreen' && this.demoMode.enabled == true) {

      this.enableVrFullscreenDemoMode();

    } else if (targetMode == 'vr-windowed' && this.currentDisplayMode !== 'vr-windowed') {

      this.enableVrWindowedMode();
    
    } else {

      console.log("ignored");

    }

    this.currentDisplayMode = targetMode;
  }

  enableMobileMode() {
    this.webview.showShadows();
    this.grid.show();
    this.siteBackground.hide();
    this.environment.hide();
    this.models.hide();
    this.stereoElements.hide();
    this.styleSheets.setVRSheet('disable');
  }

  enableVrFullscreenMode() {
    this.webview.hideShadows();
    this.grid.hide();
    this.siteBackground.show();
    this.environment.show();
    this.models.show();
    this.stereoElements.show();
    this.styleSheets.setVRSheet('enable');
  }

  enableVrFullscreenDemoMode() {

    // increment demo counter
    if (this.demoMode.currentStep < this.demoMode.steps.length - 1) { 
      this.demoMode.currentStep += 1; 
    } else {
      this.demoMode.currentStep = 0; 
    }

    // trigger demo next step in demo sequence
    if (this.demoMode.currentStep == 1) { // —— show site background

      this.webview.hideShadows();
      this.grid.hide();
      this.siteBackground.show();

    } else if (this.demoMode.currentStep == 2) { // —— show window transparency

      this.styleSheets.setVRSheet('enable');

    } else if (this.demoMode.currentStep == 3) { // —— show window-relative transforms

      this.stereoElements.show();

    } else if (this.demoMode.currentStep == 4) { // —— show 3d environment

      this.environment.show();

    } else if (this.demoMode.currentStep == 5) { // —— show window-relative models

      this.models.show();
      // TODO: distinguish window relative from world relative

    } else if (this.demoMode.currentStep == 6) { // —— Show world relative transforms and models

      // TODO

    } else if (this.demoMode.currentStep == 0) { // —— disable all

      this.webview.showShadows();
      this.grid.show();
      this.siteBackground.hide();
      this.environment.hide();
      this.models.hide();
      this.stereoElements.hide();
      this.styleSheets.setVRSheet('disable');
    }
  }

  enableVrWindowedMode() {
    // TODO: 'vr-windowed' mode is complicated. We want to keep the vr stylesheet disabled. But we also want to return the CSS3DObjects to their original positions, without hiding them.
  }
}