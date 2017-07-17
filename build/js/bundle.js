/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sceneGL, sceneCSS, rendererGL, rendererCSS;
var camera, cameraParent;
var domWrapper1, domWrapper2;
var webview, webviewShadow;
var backgroundGeometry, browserBackground;
var sheets, sheetMobile, sheetVR;

var loaderGLTF = new THREE.GLTF2Loader();
var loaderOBJ = new THREE.OBJLoader2();

var stereoElements = [];

var sceneStencil, rendererStencil, magicWindow, magicWindowCover;

var WEBVIEW_DISTANCE = 2;
var WEBVIEW_WIDTH = 0.96;
var WEBVIEW_HEIGHT = 0.64;
var CAMERA_HEIGHT = 1.6;

function init() {

  // Get style sheets
  sheets = document.styleSheets;

  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].title === 'mobile') {
      sheetMobile = sheets[i];
    } else if (sheets[i].title === 'vr') {
      sheetVR = sheets[i];
    }
  }

  sheetVR.disabled = true;

  // Create 'domWrapper' elements.
  // Seem to need two to make overscroll srolling work :p
  // We use this to wrap our page elements and pass to Three.js CSSRenderer
  domWrapper1 = document.createElement('div');
  domWrapper1.id = 'domWrapper1';
  domWrapper1.style.width = String(WEBVIEW_WIDTH * 1000) + 'px';
  domWrapper1.style.height = String(WEBVIEW_HEIGHT * 1000) + 'px';
  domWrapper1.style.overflow = 'hidden';
  domWrapper1.style.borderRadius = '8px';
  domWrapper1.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0.1)';
  domWrapper1.style.transition = 'box-shadow 0.5s east-out';
  document.body.appendChild(domWrapper1);

  domWrapper2 = document.createElement('div');
  domWrapper2.id = 'domWrapper2';
  domWrapper2.style.width = '100%';
  domWrapper2.style.height = '100%';
  domWrapper2.style.position = 'absolute';
  domWrapper2.style.top = '0';
  domWrapper2.style.left = '0';
  domWrapper2.style.overflow = 'scroll';
  domWrapper1.appendChild(domWrapper2);

  // Move page elements into the domWrapper2 element
  while (document.body.children.length > 1) {
    if (document.body.children[0].id != 'domWrapper1' || document.body.children[0].id != 'domWrapper2') {
      domWrapper2.appendChild(document.body.children[0]);
    }
  }

  // Setup scenes
  sceneGL = new THREE.Scene();
  sceneCSS = new THREE.Scene();
  sceneStencil = new THREE.Scene();

  //Setup renderers
  rendererGL = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rendererGL.setSize(window.innerWidth, window.innerHeight);
  rendererGL.domElement.style.position = 'absolute';
  rendererGL.domElement.style.overflow = 'hidden';
  rendererGL.domElement.style.top = 0;
  rendererGL.domElement.style.left = 0;
  document.body.appendChild(rendererGL.domElement);

  rendererCSS = new THREE.CSS3DRenderer();
  rendererCSS.setSize(window.innerWidth, window.innerHeight);
  rendererCSS.domElement.style.position = 'absolute';
  rendererCSS.domElement.style.overflow = 'hidden';
  rendererCSS.domElement.style.top = 0;
  rendererCSS.domElement.style.left = 0;
  document.body.appendChild(rendererCSS.domElement);

  rendererStencil = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rendererStencil.setSize(window.innerWidth, window.innerHeight);
  rendererStencil.domElement.style.position = 'absolute';
  rendererStencil.domElement.style.overflow = 'hidden';
  rendererStencil.domElement.style.top = 0;
  rendererStencil.domElement.style.left = 0;
  document.body.appendChild(rendererStencil.domElement);

  // Setup camera
  // We want to be able to rotate the camera in space around the webview.
  // So we nest the camera inside a parent Group object, which sits at webview depth, and the camera sits at 0,0,0.
  // Rotating the parent swings the camera side to side, around the webview center.
  camera = new THREE.PerspectiveCamera(80, 0.75, 0.1, 4000);
  cameraParent = new THREE.Group();
  cameraParent.position.z = -WEBVIEW_DISTANCE;
  camera.position.z = WEBVIEW_DISTANCE;
  sceneGL.add(camera, cameraParent);
  cameraParent.add(camera); // Can only add camera to parent group -after- adding both to the scene.

  //Setup browser background
  backgroundGeometry = new THREE.SphereGeometry(1000, 64, 64);
  backgroundGeometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

  browserBackground = new THREE.Mesh(backgroundGeometry, new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    map: new THREE.TextureLoader().load('images/environments/graygrid-360.png')
  }));
  browserBackground.rotation.set(0, -1.57, 0);
  sceneGL.add(browserBackground);

  // Setup shadow
  webviewShadow = new THREE.Mesh(new THREE.PlaneGeometry(WEBVIEW_WIDTH, 0.04), new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.04,
    color: 0x000000
  }));
  webviewShadow.rotation.x = -1.57;
  webviewShadow.position.y = -CAMERA_HEIGHT;
  webviewShadow.position.z = -WEBVIEW_DISTANCE;
  webviewShadow.scale.set(WEBVIEW_DISTANCE, WEBVIEW_DISTANCE, WEBVIEW_DISTANCE);
  sceneGL.add(webviewShadow);

  // Setup 'webview': the variable name we give the outer DOM wrapper, once it's converted into a Three.js CSS3DObject.
  webview = new THREE.CSS3DObject(domWrapper1);

  // We scale sceneCSSS by 0.0001 to convert from pixels to meters. So 1px = 0.001 meter
  webview.position.z = metersToPx(-WEBVIEW_DISTANCE);
  webview.scale.set(WEBVIEW_DISTANCE, WEBVIEW_DISTANCE, WEBVIEW_DISTANCE);
  sceneCSS.scale.set(0.001, 0.001, 0.001);
  sceneCSS.add(webview);

  // Setup magic window
  // First, a sphere to hide everything
  // Then a plane, to "punch through" the sphere. Jaume and I worked out this code in fall 2016. ColorWrite and RenderOrder values are the key.
  magicWindowCover = new THREE.Mesh(new THREE.SphereGeometry(100, 64, 64), new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('images/environments/graygrid-360.png'),
    transparent: true
  }));
  magicWindowCover.renderOrder = 1;

  magicWindow = new THREE.Mesh(new THREE.PlaneGeometry(WEBVIEW_WIDTH, WEBVIEW_HEIGHT), new THREE.MeshPhongMaterial({
    color: 0xF0D339,
    colorWrite: false,
    side: THREE.DoubleSide
  }));
  magicWindow.renderOrder = 0;
  magicWindow.scale.set(WEBVIEW_DISTANCE, WEBVIEW_DISTANCE, WEBVIEW_DISTANCE);
  magicWindow.position.z = -WEBVIEW_DISTANCE;

  // sceneStencil.add( magicWindowCover );
  // sceneStencil.add( magicWindow )


  // addLights();

  // Start scene
  onWindowResize();
  animate();
  setTimeout(function () {
    // do stuff after delay
  }, 500);
}

function addLights() {
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 1000, 100);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  sceneGL.add(spotLight);
}

// var textureLoader = new THREE.TextureLoader();

// function loadTexture() {

//   // new THREE.TextureLoader().load( 'images/environments/graygrid-360.png')
//   // textureLoader.load()
// }


/* ----- UTILITIES ----- */

function toggleWebGLVisibility(target, duration) {

  console.log(target);

  if (target.material.opacity == '1') {
    new TWEEN.Tween(target.material).to({ opacity: 0 }, duration).start();
  } else {
    new TWEEN.Tween(target.material).to({ opacity: 1 }, duration).start();
  }
}

function toggleCSSVisibility(target) {

  var el = document.querySelector(target);

  if (el.style.opacity == '1') {
    el.style.opacity = '0';
    setTimeout(function () {
      el.style.display = 'none';
    }, 100);
  } else {
    el.style.display = 'block';
    // Delay setting opacity, or opacity transition will not fire, due to https://bugs.chromium.org/p/chromium/issues/detail?id=121340
    setTimeout(function () {
      el.style.opacity = 1;
    }, 100);
  }
}

function hideObject(el) {
  el.style.display = 'none';
}

function showObject(el) {
  el.style.display = 'block';
}

function hideWebviewShadows() {

  domWrapper1.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0)';

  new TWEEN.Tween(webviewShadow.material).to({ opacity: 0 }, 500).start();
}

function metersToPx(meters) {
  return meters * 1000;
}

// getTransform and parseMatrix functions taken from Keith Clark:
// http://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/
function getTransform(element) {
  var matrix = parseMatrix(getComputedStyle(element, null).transform),
      rotateY = Math.asin(-matrix.m13),
      rotateX,
      rotateZ;

  if (Math.cos(rotateY) !== 0) {
    rotateX = Math.atan2(matrix.m23, matrix.m33);
    rotateZ = Math.atan2(matrix.m12, matrix.m11);
  } else {
    rotateX = Math.atan2(-matrix.m31, matrix.m22);
    rotateZ = 0;
  }
  return {
    rotate: { x: rotateX, y: rotateY, z: rotateZ },
    translate: { x: matrix.m41, y: matrix.m42, z: matrix.m43 },
    scale: { x: matrix.m11, y: matrix.m22, z: matrix.m33 }
  };
}

function parseMatrix(matrixString) {
  var c = matrixString.split(/\s*[(),]\s*/).slice(1, -1),
      matrix;
  if (c.length === 6) {
    // 'matrix()' (3x2)
    matrix = {
      m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
      m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
      m13: 0, m23: 0, m33: 1, m43: 0,
      m14: 0, m24: 0, m34: 0, m44: 1
    };
  } else if (c.length === 16) {
    // matrix3d() (4x4)
    matrix = {
      m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
      m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
      m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
      m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
    };
  } else {
    // handle 'none' or invalid values.
    matrix = {
      m11: 1, m21: 0, m31: 0, m41: 0,
      m12: 0, m22: 1, m32: 0, m42: 0,
      m13: 0, m23: 0, m33: 1, m43: 0,
      m14: 0, m24: 0, m34: 0, m44: 1
    };
  }
  return matrix;
}

// TODO: Combined into a single generic function that can tell whether property value is a url().
// For now I need to know ahead of time the CSS value so I know which function to call.
function parseCssVar(element, varName) {
  var elementStyles = window.getComputedStyle(element);
  return elementStyles.getPropertyValue(varName).trim();
}

function parseCssUrl(element, varName) {
  var css_url = window.getComputedStyle(element).getPropertyValue(varName);

  if (!css_url) {
    // if no custom property found...
    console.log('Could not find custom property named: ' + varName);
  } else {
    // if property found...

    // Grabbed from: gist.github.com/eligrey/1129978
    var uri = css_url.match(/^\s*url\(\s*(.*)\s*\)\s*$/)[1],
        last = uri.length - 1;
    if (uri[0] === '"' && uri[last] === '"' || uri[0] === "'" && uri[last] === "'") {
      uri = uri.slice(1, -1);
    }
    return uri;
  }
}

// Create a JSON object for each stereo element
// And "start" (windowed mode) and "target" (fullscreen mode) values.

function createStereoObjects() {

  // Enable the VR style sheet, so we can grab it's values
  sheetVR.disabled = false;

  // Get all elements. Loop through them
  var all = domWrapper2.getElementsByTagName('*');

  // Find stereo elements and save them to array.
  for (var i = 0; i < all.length; i++) {

    var element = all[i];
    var transformStyle = parseCssVar(element, '--transform-style');
    var transform = parseCssVar(element, 'transform');

    // It's not enough to check for --transform-style: stereo,
    // because we get false positives on children, which inherit it from parent.
    // What we can about are stereo elements with 3D transforms.
    // We get them by filtering out elements with transform 'none'.
    if (transformStyle == 'stereo' && transform !== 'none') {

      // Create an object for each element that matches the criteria, and push to the stereoElements array. We'll use it later.
      var object = {};
      object.element = element;
      stereoElements.push(object);
    }
  }

  // For each stereElement, populate it's value.
  for (var i = 0; i < stereoElements.length; i++) {

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

    // Store original element (VR) values
    var targetScaleX = object.targetScaleX = getTransform(element).scale.x;
    var targetScaleY = object.targetScaleY = getTransform(element).scale.y;

    // Clone the original element:
    // The clone stays in the position in page flow, and the original element is turned into a CSS3D object.
    // This preserves the original layout during the transition by avoiding reflows created when original element is positioned absolute.
    // Original element also retains it's event listeners.
    var clone = object.clone = element.cloneNode(true);
    element.parentElement.insertBefore(clone, element);

    // If the original element is position:absolute, zero out position values and change to relative, before converting to a CSS3DObject.
    // This helps ensure that it's 'after' position matches it's 'before'.
    if (window.getComputedStyle(element).getPropertyValue('position') == 'absolute') {
      element.style.top = element.style.bottom = element.style.left = element.style.right = 0;
      element.style.position = 'relative';
    }

    // Make a CSS3D object from the target
    var threeElement = object.threeElement = new THREE.CSS3DObject(element);

    if (coordinateSpace == 'world') {

      threeElement.position.x = 0;
      threeElement.position.y = 0;
      threeElement.position.z = metersToPx(-WEBVIEW_DISTANCE);

      var targetTransformX = object.targetTransformX = getTransform(element).translate.x;
      var targetTransformY = object.targetTransformY = getTransform(element).translate.y;
      var targetTransformZ = object.targetTransformZ = getTransform(element).translate.z;

      // Add threeElement to the scene.
      sceneCSS.add(threeElement);
    } else {

      object.coordinateSpace = "window";

      // Match this object's position/rotation to the original target element
      threeElement.position.x = startX + startWidth / 2 - metersToPx(WEBVIEW_WIDTH) / 2;
      threeElement.position.y = -startY - startHeight / 2 + metersToPx(WEBVIEW_HEIGHT) / 2;
      threeElement.position.z = 0.0001;

      var targetTransformX = object.targetTransformX = threeElement.position.x + getTransform(element).translate.x;
      var targetTransformY = object.targetTransformY = threeElement.position.y + getTransform(element).translate.y;
      var targetTransformZ = object.targetTransformZ = getTransform(element).translate.z;

      // Add object to the scene as a child of the webview CSS3D object, so positions are relative
      webview.add(threeElement);
    }

    element.style.visibility = 'hidden'; // hide the CSS3DObject to start (by setting visibility style of the original element)
  }

  // Disable the VR style sheet when done, to set things back to normal.
  sheetVR.disabled = true;
}

function loadBackground(element, customProp) {

  // get URL of texture from CSS custom property
  var texture_url = parseCssUrl(document.querySelector(element), customProp);

  // TODO: check if url is valid url before proceeding

  // create new sphere mesh, textured with URL
  var siteBackground = new THREE.Mesh(backgroundGeometry, new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0,
    map: new THREE.TextureLoader().load(texture_url)
  }));
  siteBackground.rotation.set(0, -1.57, 0);
  siteBackground.scale.set(0.99, 0.99, 0.99);
  sceneGL.add(siteBackground);

  new TWEEN.Tween(siteBackground.material).to({ opacity: 1 }, 500).start();
}

function loadEnvironment_GLTF(element, customProp) {

  // get URL of texture from CSS custom property
  var model_url = parseCssUrl(document.querySelector(element), customProp);

  // load url
  loaderGLTF.load(model_url, function (gltf) {
    sceneGL.add(gltf.scene);

    gltf.animations; // Array: THREE.AnimationClip
    gltf.scene; // THREE.Scene
    gltf.scenes; // Array: THREE.Scene
    gltf.cameras; // Array: THREE.Camera

    gltf.scene.position.set(0, 0, -4);
  });
}

function loadEnvironment_OBJ(element, customProp) {

  // get URL of texture from CSS custom property
  var model_url = parseCssUrl(document.querySelector(element), customProp);

  // load url
  loaderOBJ.load(model_url, function (obj) {
    sceneGL.add(obj);
    obj.position.set(0, 0, -1);

    new TWEEN.Tween(obj.position).to({ x: 0.15, y: -0.15, z: -0.3 }, 4000).start();

    new TWEEN.Tween(obj.rotation).to({ x: Math.PI / 2, y: Math.PI / 2, z: Math.PI / 2 }, 4000).start();
  });
}

function setDisplayMode(mode) {

  if (mode == 'fullscreen') {

    sheetVR.disabled = false;
    loadBackground('body', '--background');
    hideWebviewShadows();
  } else if (mode == 'windowed') {}

  for (var i = 0; i < stereoElements.length; i++) {

    var object = stereoElements[i];
    var threeElement = object.threeElement;

    // Animate to new position, scale, rotation

    object.element.style.visibility = 'visible';
    object.clone.style.visibility = 'hidden'; // TODO: Move this (and all styling) out of here

    if (object.targetTransformX) {
      new TWEEN.Tween(object.threeElement.position).to({ x: object.targetTransformX }, 750).easing(TWEEN.Easing.Quadratic.InOut).start();
    }

    if (object.targetTransformY) {
      new TWEEN.Tween(object.threeElement.position).to({ y: object.targetTransformY }, 750).easing(TWEEN.Easing.Quadratic.InOut).start();
    }

    if (object.targetTransformZ) {
      new TWEEN.Tween(object.threeElement.position).to({ z: object.targetTransformZ }, 750).easing(TWEEN.Easing.Quadratic.InOut).start();
    }

    if (object.targetScaleX) {
      new TWEEN.Tween(object.threeElement.scale).to({ x: object.targetScaleX }, 750).easing(TWEEN.Easing.Quadratic.InOut).start();
    }

    if (object.targetScaleY) {
      new TWEEN.Tween(object.threeElement.scale).to({ y: object.targetScaleY }, 750).easing(TWEEN.Easing.Quadratic.InOut).start();
    }
  }
}

/* ----- EVENT LISTENERS ----- */

window.addEventListener('resize', onWindowResize, false);

window.addEventListener('keydown', function (e) {

  var handled = false;

  // Check if meta or ctrl keys are pressed. If not, proceed. Ensures keyboard shortcuts work properly on Mac & Windows.
  if (!e.metaKey || !e.metaKey) {

    switch (e.keyCode) {

      case 49:
        {
          // 1 —— Load VR styles and apply to scene.

          // loadEnvironment_GLTF('body', '--environment');
          createStereoObjects();

          handled = true;
          break;
        }
      case 50:
        {
          // 2 —— Switch to windowed mode


          setDisplayMode('fullscreen');

          handled = true;
          break;
        }
      case 51:
        {
          // 3 —— 

          toggleWebGLVisibility(magicWindowCover);

          handled = true;
          break;
        }
      case 52:
        {
          // 4 —— 

          handled = true;
          break;
        }
      case 53:
        {
          // 5 —— look side-to-side

          var tweenA = new TWEEN.Tween(camera.rotation).to({ x: .1, y: .4 }, 1000).easing(TWEEN.Easing.Quadratic.InOut);

          var tweenB = new TWEEN.Tween(camera.rotation).to({ x: .05, y: -.7 }, 1600).easing(TWEEN.Easing.Quadratic.InOut);

          var tweenC = new TWEEN.Tween(camera.rotation).to({ x: -0.03, y: 0.04 }, 1700).easing(TWEEN.Easing.Quadratic.InOut);

          var tweenD = new TWEEN.Tween(camera.rotation).to({ x: 0, y: 0 }, 600).easing(TWEEN.Easing.Quadratic.InOut);

          tweenA.chain(tweenB);
          tweenB.chain(tweenC);
          tweenC.chain(tweenD);
          tweenA.start();

          handled = true;
          break;
        }

      case 54:
        {
          // 6 —— lean head from side to side, around window edges

          camera.updateProjectionMatrix();
          var tweenA = new TWEEN.Tween(cameraParent.rotation).to({ y: 1 }, 1250).easing(TWEEN.Easing.Quadratic.Out);

          var tweenB = new TWEEN.Tween(cameraParent.rotation).to({ y: -1 }, 3000).easing(TWEEN.Easing.Quadratic.InOut);

          var tweenC = new TWEEN.Tween(cameraParent.rotation).to({ y: 0 }, 1500).easing(TWEEN.Easing.Quadratic.InOut);

          tweenA.chain(tweenB);
          tweenB.chain(tweenC);
          tweenA.start();

          handled = true;
          break;
        }

      case 32:
        {
          // space

          handled = true;
          break;
        }
    }

    if (handled) e.preventDefault();
  }
});

/* ----- WINDOW RESIZES ----- */

function onWindowResize() {

  var w = window.innerWidth;
  var h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  rendererGL.setSize(w, h);
  rendererCSS.setSize(w, h);
  rendererStencil.setSize(w, h);
}

function animate() {

  requestAnimationFrame(animate);
  TWEEN.update();

  rendererGL.render(sceneGL, camera);
  rendererCSS.render(sceneCSS, camera);
  rendererStencil.render(sceneStencil, camera);
}

/* ----- START SCENE ----- */

window.onload = function () {
  init();
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map