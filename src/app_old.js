'use strict';

import {
  toggleWebGLVisibility,
  toggleCSSVisibility,
  toggleWebviewShadows,
  metersToPx,
  getTransform,
  parseMatrix,
  parseCssVar,
  parseCssUrl
} from './utilities';

import { setupEvents } from './events';
import { camera } from './camera';
import Config from './config';
import Renderer from './renderer';

let sceneGL, sceneCSS, rendererGL, rendererCSS;
let cameraTarget;
let domWrapper, webview, webviewShadow, cssRoot;
let browserBackground, siteBackground;
let sheets, styleSheetMobile, styleSheetVR;
let currentDisplayMode;
let stereoElements = [];
let sceneStencil, rendererStencil, magicWindow, magicWindowCover;
let container;

// var textureLoader = new THREE.TextureLoader();

// function loadTexture() {

//   // new THREE.TextureLoader().load( 'images/environments/graygrid-360.png')
//   // textureLoader.load()
// }


/* ----- SETUP ----- */

function setupStyleSheets() {

  // Get style sheets
  sheets = document.styleSheets;

  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].title === 'mobile') {
      styleSheetMobile = sheets[i];
    } else if (sheets[i].title === 'vr') {
      styleSheetVR = sheets[i];
    }
  }

  styleSheetVR.disabled = true;
}

function setupScene() {

  // 'domWrapper' element wraps our page elements and is pass to Three.js CSSRenderer
  domWrapper = document.createElement('div');
  domWrapper.id = 'domWrapper';
  domWrapper.style.width = String(Config.WEBVIEW_WIDTH * 1000) + 'px';
  domWrapper.style.height = String(Config.WEBVIEW_HEIGHT * 1000) + 'px';
  domWrapper.style.position = 'relative';
  domWrapper.style.overflow = 'scroll';
  domWrapper.style.borderRadius = '8px';
  domWrapper.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0.1)';
  domWrapper.style.transition = 'box-shadow 0.5s east-out'
  document.body.appendChild(domWrapper);

  // Move page elements into the domWrapper element
  while (document.body.children.length > 1) {
    if (document.body.children[0].id != 'domWrapper') {
      domWrapper.appendChild(document.body.children[0]);
    }
  }

  // Setup scenes
  sceneGL = new THREE.Scene();
  sceneCSS = new THREE.Scene();
  sceneStencil = new THREE.Scene();

  this.renderer = new Renderer(sceneGL);

  //Setup renderers
  // rendererGL = new THREE.WebGLRenderer({antialias: true, alpha: true});
  // rendererGL.setSize(window.innerWidth, window.innerHeight);
  // rendererGL.domElement.style.position = 'absolute';
  // rendererGL.domElement.style.top = 0;
  // rendererGL.domElement.style.left = 0;
  // rendererGL.domElement.style.pointerEvents = 'none';
  
  rendererCSS = new THREE.CSS3DRenderer();
  rendererCSS.setSize(window.innerWidth, window.innerHeight);
  rendererCSS.domElement.style.position = 'absolute';
  rendererCSS.domElement.style.top = 0;
  rendererCSS.domElement.style.left = 0;

  rendererStencil = new THREE.WebGLRenderer({antialias: true, alpha: true});
  rendererStencil.setSize(window.innerWidth, window.innerHeight);
  rendererStencil.domElement.style.position = 'absolute';
  rendererStencil.domElement.style.top = 0;
  rendererStencil.domElement.style.left = 0;
  rendererStencil.domElement.style.pointerEvents = 'none';
  
  // document.body.appendChild(rendererGL.domElement);
  // document.body.appendChild(rendererStencil.domElement);
  document.body.appendChild(rendererCSS.domElement);

  // Setup cameras
  camera.scale.set(0.01, 0.01, 0.01);
  // cameraTarget = new THREE.Group();
  // cameraTarget.position.z = -WEBVIEW_DISTANCE;
  // sceneGL.add(cameraTarget);
  sceneGL.add(camera);
  // camera.lookAt(cameraTarget.position);
  // cameraCSS.lookAt(cameraTarget.position);

  // Setup 'webview': the variable name we give the outer DOM wrapper, once it's converted into a Three.js CSS3DObject.
  webview = new THREE.CSS3DObject(domWrapper);
  webview.position.z = metersToPx(-Config.WEBVIEW_DISTANCE);
  webview.scale.set(Config.WEBVIEW_DISTANCE, Config.WEBVIEW_DISTANCE, Config.WEBVIEW_DISTANCE);

  // Setup cssRoot and scale by 0.001. We do this becaue CSS styles are in px.
  // All subsequent CSS objects are added to cssRoot.
  cssRoot = new THREE.Object3D();
  cssRoot.scale.set(0.001, 0.001, 0.001); 
  cssRoot.add(webview);
  sceneCSS.add(cssRoot);

  //Setup browser background
  var backgroundGeometry = new THREE.SphereGeometry(Config.BACKGROUND_RADIUS, 64, 64);
  backgroundGeometry.applyMatrix(new THREE.Matrix4().makeScale( -1, 1, 1 ));

  browserBackground = new THREE.Mesh(
    backgroundGeometry,
    new THREE.MeshBasicMaterial({ 
      shading: THREE.FlatShading,
      map: new THREE.TextureLoader().load('images/environments/graygrid-360.png')
    })
  );
  browserBackground.rotation.set( 0, -1.57, 0);
  sceneGL.add(browserBackground);

  // Setup shadow
  // webviewShadow = new THREE.Mesh(
  //     new THREE.PlaneGeometry(WEBVIEW_WIDTH, 0.04),
  //     new THREE.MeshBasicMaterial({
  //       transparent: true,
  //       opacity: 0.04,
  //       color: 0x000000
  //     })
  // );
  // webviewShadow.rotation.x = -1.57
  // webviewShadow.position.y = -CAMERA_HEIGHT;
  // webviewShadow.position.z = -WEBVIEW_DISTANCE;
  // webviewShadow.scale.set(WEBVIEW_DISTANCE, WEBVIEW_DISTANCE, WEBVIEW_DISTANCE);
  // sceneGL.add(webviewShadow);

  // Setup magic window
  // First, a sphere to hide everything
  // Then a plane, to "punch through" the sphere. Jaume and I worked out this code in fall 2016. ColorWrite and RenderOrder values are the key.
  magicWindowCover = new THREE.Mesh (
    new THREE.SphereGeometry(100, 64, 64),
    new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load( 'images/environments/graygrid-360.png'),
      transparent: true,
    })
  )
  magicWindowCover.renderOrder = 1;

  magicWindow = new THREE.Mesh(
    new THREE.PlaneGeometry( Config.WEBVIEW_WIDTH, Config.WEBVIEW_HEIGHT ),
    new THREE.MeshPhongMaterial( { 
      color: 0xF0D339,
      colorWrite: false,
      side: THREE.DoubleSide
     } )
  );
  magicWindow.renderOrder = 0;
  magicWindow.scale.set(Config.WEBVIEW_DISTANCE, Config.WEBVIEW_DISTANCE, Config.WEBVIEW_DISTANCE);
  magicWindow.position.z = -Config.WEBVIEW_DISTANCE;
  
  // sceneStencil.add( magicWindowCover );
  // sceneStencil.add( magicWindow )

}

function setupSiteBackground() {

  styleSheetVR.disabled = false;

  // Get URL of texture from CSS custom property. TODO: check if url is valid url before proceeding
  // Then Create new sphere mesh, textured with URL
  const texture_url = parseCssUrl(document.querySelector('body'), '--background');
  const backgroundGeometry = new THREE.SphereGeometry(Config.BACKGROUND_RADIUS - 10, 64, 64);

  styleSheetVR.disabled = true;

  backgroundGeometry.applyMatrix(new THREE.Matrix4().makeScale( -1, 1, 1 ));
  siteBackground = new THREE.Mesh(
    backgroundGeometry,
    new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      transparent: true,
      opacity: 0,
      map: new THREE.TextureLoader().load(texture_url)
    })
  );
  
  siteBackground.rotation.set( 0, -1.57, 0);
  siteBackground.scale.set(0.99, 0.99, 0.99);
  sceneGL.add(siteBackground);
}


// Parse the VR styles and create VR objects (e.g. 3D elements, 360 background)
// Creates a JSON object for each stereo element, with "start" (windowed mode) and "target" (fullscreen mode) values.
function setupStereoElements() {

  // Enable the VR style sheet, so we can grab it's values
  styleSheetVR.disabled = false;

  // Get all elements. Loop through them
  var all = domWrapper.getElementsByTagName('*');

  // Find stereo elements and save them to array.
  for (var i = 0; i < all.length; i++) {
       
    var element = all[i];
    var transformStyle = parseCssVar(element, '--transform-style');
    var transform =  parseCssVar(element, 'transform');

    // It's not enough to check for --transform-style: stereo,
    // because we get false positives on children, which inherit it from parent.
    // What we can about are stereo elements with 3D transforms.
    // We get them by filtering out elements with transform 'none'.
    if(transformStyle == 'stereo' && transform !== 'none') {

      // Create an object for each element that matches the criteria, and push to the stereoElements array. We'll use it later.
      var object = {};
      object.element = element;
      stereoElements.push(object);

    }
  }

  // For each stereElement, populate it's value.
  for (var i = 0; i < stereoElements.length; i++)  {

    var object = stereoElements[i];

    var element = object.element;
    object.name = element.id;

    // Get element position and size values
    var coordinateSpace = object.coordinateSpace = parseCssVar(element, '--position');
    
    // Store start (non-3D) values
    var startWidth = object.startWidth = parseInt(window.getComputedStyle(element).getPropertyValue('width'));
    var startHeight = object.startHeight = parseInt(window.getComputedStyle(element).getPropertyValue('height'));
    var startX = object.startX = element.offsetLeft;
    var startY = object.startY = element.offsetTop;
    var startZ;

    // Store original element (VR) values
    var targetScaleX = object.targetScaleX = getTransform(element).scale.x;
    var targetScaleY = object.targetScaleY = getTransform(element).scale.y;

    // Clone the original element:
    // The clone stays in the position in page flow, and the original element is turned into a CSS3D object.
    // This preserves the original layout during the transition by avoiding reflows created when original element is positioned absolute.
    // Original element also retains it's event listeners.
    var clone = object.clone = element.cloneNode(true);
    element.parentElement.insertBefore( clone, element );

    // If the original element is position:absolute, zero out position values and change to relative, before converting to a CSS3DObject.
    // This helps ensure that it's 'after' position matches it's 'before'.
    if ( window.getComputedStyle(element).getPropertyValue('position') == 'absolute' ) {
      element.style.top = element.style.bottom = element.style.left = element.style.right = 0;
      element.style.position = 'relative';
    }

    // Make a CSS3D object from the target
    var threeElement = object.threeElement = new THREE.CSS3DObject(element);

    if (coordinateSpace == 'world') {

      threeElement.position.x = 0;
      threeElement.position.y = 0;
      threeElement.position.z = metersToPx(-Config.WEBVIEW_DISTANCE);

      var targetTransformX = object.targetTransformX = getTransform(element).translate.x;
      var targetTransformY = object.targetTransformY = getTransform(element).translate.y;
      var targetTransformZ = object.targetTransformZ  = getTransform(element).translate.z;

      // Add threeElement to the scene.
      sceneCSS.add(threeElement);    

    } else {

      object.coordinateSpace = "window";
      
      // Match this object's position/rotation to the original target element
      threeElement.position.x = startX + startWidth / 2 - metersToPx(Config.WEBVIEW_WIDTH) / 2;
      threeElement.position.y = -startY - startHeight / 2 + metersToPx(Config.WEBVIEW_HEIGHT) / 2;
      threeElement.position.z = 0.0001;

      object.startX = threeElement.position.x;
      object.startY = threeElement.position.y;
      object.startZ = threeElement.position.z;
      var targetTransformX = object.targetTransformX = threeElement.position.x + getTransform(element).translate.x;
      var targetTransformY = object.targetTransformY = threeElement.position.y + getTransform(element).translate.y;
      var targetTransformZ = object.targetTransformZ = getTransform(element).translate.z; 

      // Add object to the scene as a child of the webview CSS3D object, so positions are relative
      webview.add(threeElement);
    }

    element.style.visibility = 'hidden'; // hide the CSS3DObject to start (by setting visibility style of the original element)
  }

  // Disable the VR style sheet when done, to set things back to normal.
  styleSheetVR.disabled = true;
}

function toggleCSS3dElements(mode, duration = 500) {

  for (var i = 0; i < stereoElements.length; i++) {

    var object = stereoElements[i];
    var threeElement = object.threeElement;
    var tranX, tranY, tranZ, scaleX, scaleY;

    // Animate to new position, scale, rotation

    if (object.coordinateSpace == 'window') {
    
      if (mode == 'show') {

        object.element.style.visibility = 'visible';
        object.clone.style.visibility = 'hidden';
        tranX = object.targetTransformX;
        tranY = object.targetTransformY;
        tranZ = object.targetTransformZ;
        scaleX = object.targetScaleX;
        scaleY = object.targetScaleY;

      } else if (mode == 'hide') {

        let delay = duration;
        toggleCSSVisibility(object.element, 'hide', delay) // wait until position tweens complete to hide the CSS3D versions.
        toggleCSSVisibility(object.clone, 'show', delay) // wait until position tweens complete to show the inline ("clone") versions. This makes transition seamless.
        tranX = object.startX;
        tranY = object.startY;
        tranZ = object.startZ;
        scaleX = 1;
        scaleY = 1;
      }

      if(tranX) {
        new TWEEN.Tween(object.threeElement.position)
          .to({x: tranX}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(tranY) {
        new TWEEN.Tween(object.threeElement.position)
          .to({y: tranY}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(tranZ) {
        new TWEEN.Tween(object.threeElement.position)
          .to({z: tranZ}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(scaleX) {
        new TWEEN.Tween(object.threeElement.scale)
          .to({x: scaleX}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(scaleY) {
        new TWEEN.Tween(object.threeElement.scale)
          .to({y: scaleY}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }
    }
  }
}

function setDisplayMode(targetMode) {

  if (targetMode == 'mobile' && currentDisplayMode != 'mobile') {

    toggleCSS3dElements('hide');
    toggleWebGLVisibility(siteBackground, 'hide');
    toggleWebviewShadows('show');
    styleSheetVR.disabled = true;
    currentDisplayMode = targetMode;

  } else if ( targetMode == 'vr-fullscreen' && currentDisplayMode != 'vr-fullscreen') {

    toggleCSS3dElements('show');
    toggleWebGLVisibility(siteBackground, 'show');
    toggleWebviewShadows('hide');
    styleSheetVR.disabled = false;
    currentDisplayMode = targetMode;

  } else if (targetMode == 'vr-windowed' && currentDisplayMode != 'vr-windowed') {

    currentDisplayMode = targetMode;
  
  }
}






/* ----- INIT ----- */

function init() {

  setupStyleSheets();
  setupScene();
  setupStereoElements();
  setupSiteBackground();
  setupEvents();
  onWindowResize();
  animate();
  
}

/* ----- WINDOW RESIZE ----- */

window.addEventListener('resize', onWindowResize, false );

function onWindowResize() {

  let w = window.innerWidth
  let h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  // rendererGL.setSize( w, h );
  rendererCSS.setSize( w, h );
  // rendererStencil.setSize( w, h );
}

/* ----- ANIMATE ----- */

function animate() {

  requestAnimationFrame( animate );
  TWEEN.update();

  // rendererGL.render( sceneGL, camera );
  rendererCSS.render( sceneCSS, camera );
  // rendererStencil.render( sceneStencil, camera );

}

/* ----- START SCENE ----- */

window.onload = function() {
  init();
}