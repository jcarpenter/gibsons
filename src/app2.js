'use strict';

import Background from './background';
import Camera from './camera';
import Config from './config';
import Container from './container';
import Css3dObjects from './css3dObjects';
import CssRoot from './cssRoot'
import DomWrapper from './domWrapper'
import Events from './events';
import RendererCSS from './rendererCSS';
import RendererGL from './rendererGL';
import State from './state';
import StyleSheets from './styleSheets';
import WebView from './webview';

// app class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class App {
  constructor() {

    // create container element
    this.container = new Container();

    // create scenes
    this.sceneGL = new THREE.Scene()
    this.sceneCSS = new THREE.Scene()
    
    // instantiate renderers
    this.rendererGL = new RendererGL(this.sceneGL, this.container.container)
    this.rendererCSS = new RendererCSS(this.sceneCSS, this.container.container)

    // instantiate camera
    this.camera = new Camera(this.rendererGL.renderer);

    // instantiate cssRoot object (we add all CSS objects to this)
    this.cssRoot = new CssRoot(this.sceneCSS);

    // instantiate 'domWrapper': an element containing all the original HTML elements
    this.domWrapper = new DomWrapper();

    // instantiate 'webview': simply the domWrapper converted to a CSS3D object, sized and positioned like a browser window in ChromeVR.
    this.webview = new WebView(this.cssRoot, this.domWrapper);

    //instantiate styles
    this.styleSheets = new StyleSheets();

    // instantiate CSS3D objects. Pass in cssRoot, webview and domWrapper. They're needed for setup purposes.
    this.stereoElements = new Css3dObjects(this.cssRoot, this.webview, this.domWrapper, this.styleSheets); // array

    // instantiate backgrounds
    this.browserBackground = new Background(this.sceneGL, 'images/environments/graygrid-360.png', 1);
    this.siteBackground = new Background(this.sceneGL, 'images/environments/puydesancy.jpg', 0.9); // TODO: make this not hard-coded
    this.siteBackground.object.rotation.set( 0, -1.57, 0);

    // instantiate state
    this.state = new State(this.styleSheets, this.stereoElements, this.siteBackground, this.webview);
    this.state.setDisplayMode('mobile');

    // instantiate events
    this.events = new Events(this.camera, this.state,)

    // start render loop
    this.render();
  }

  render() {
    TWEEN.update();
    this.rendererGL.render(this.sceneGL, this.camera.camera);
    this.rendererCSS.render(this.sceneCSS, this.camera.camera);
    requestAnimationFrame(this.render.bind(this)); // bind the main class instead of window object
  }
}