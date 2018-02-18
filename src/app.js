'use strict';

// Common to all modes
import Config from './config';
import Events from './events';
import State from './state';

// For converting to CSS 3D
import Container from './container';
import Css3dObjects from './css3dObjects';
import CssRoot from './cssRoot'
import DomWrapper from './domWrapper'
import Environment from './environment'
import Lights from './lights';
import Models from './models';
import StyleSheets from './styleSheets';
import WebView from './webview';

// Differ based on VR versus AR
import Grid from './grid'; // not needed for AR
import Camera from './camera'; // is completely different from pseudo-VR versus AR
import Background from './background'; // is less important for AR
import RendererCSS from './rendererCSS'; // may be the same for VR vs AR?
import RendererGL from './rendererGL'; // same as above


// Start by doing nothing to the site. Ignore `title="vr"` stylesheet.
// If mobile phones, is a mobile site.
// If desktop, can be either mobile or VR site
// If AR capable mobile, can be mobile or AR site.
// Controls to turn into CSS3D live in 2D menu. With key presses wired.

// Display in default presentation mode (e.g. mobile, desktop)
// Menu or keyboard shortcuts to switch between modes.
// When user presses VR button, kick into VR display mode.


// app class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class App {
  constructor() {

    // instantiate styles
    this.styleSheets = new StyleSheets();
    // disable any stylesheets with title="vr".
    this.styleSheets.setVRSheet('disable');

    // enter VR display mode.


    // enter AR display mode.


    

    // create container element
    this.container = new Container();

    // create scenes
    this.sceneGLFar = new THREE.Scene()
    this.sceneCSS = new THREE.Scene()
    this.sceneGLNear = new THREE.Scene()
    
    // instantiate renderers
    this.rendererGLFar = new RendererGL(this.sceneGLFar, this.container.container);
    this.rendererCSS = new RendererCSS(this.sceneCSS, this.container.container);
    this.rendererGLNear = new RendererGL(this.sceneGLNear, this.container.container);
    this.rendererGLNear.renderer.domElement.style.pointerEvents = 'none';

    // instantiate camera
    this.camera = new Camera(this.rendererGLNear.renderer);

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

    // instantiate environment model
    this.environment = new Environment(this.sceneGLFar, this.styleSheets);

    // instantiate <model> elements
    this.models = new Models(this.sceneGLFar, this.sceneGLNear, this.domWrapper, this.styleSheets);

    // instantiate lighting
    // we need to create one instance of the lighting for each GL renderer (near and far).
    this.lightsFar = new Lights(this.sceneGLFar);
    this.lightsNear = new Lights(this.sceneGLNear);

    // instantiate backgrounds
    this.browserBackground = new Background(this.sceneGLFar, 'images/environments/gray-gradient.jpg', 1);
    this.grid = new Grid(this.sceneGLFar);
    this.siteBackground = new Background(this.sceneGLFar, 'images/environments/puydesancy.jpg', 0.9); // TODO: make this not hard-coded?
    this.siteBackground.object.rotation.set( 0, -1.57, 0);

    // instantiate state
    this.state = new State(this.styleSheets, this.stereoElements, this.siteBackground, this.grid, this.webview, this.environment, this.models);
    this.state.setDisplayMode('mobile');

    // instantiate events
    this.events = new Events(this.camera, this.state,)
    

    // start render loop
    this.render();
    
  }


  render() {
    TWEEN.update();

    //if this.state.mode = 2D, do nothing
    //if this.state.mode = VR, 

    // lookAt logic has to check per-frame in the render loop, AFAIK. Variable names and paths here are pretty clunky.
    if(this.camera.lookAt) { 
        this.camera.camera.lookAt(this.camera.lookAtTarget);
    }

    this.rendererGLFar.render(this.sceneGLFar, this.camera.camera);
    this.rendererCSS.render(this.sceneCSS, this.camera.camera);
    this.rendererGLNear.render(this.sceneGLNear, this.camera.camera);

    requestAnimationFrame(this.render.bind(this)); // bind the main class instead of window object
  }
}