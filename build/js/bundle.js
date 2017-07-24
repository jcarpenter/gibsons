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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	WEBVIEW_DISTANCE: 2,
	WEBVIEW_WIDTH: 0.96,
	WEBVIEW_HEIGHT: 0.64,
	CAMERA_HEIGHT: 1.6,
	CAMERA_FOV: 80,
	CAMERA_NEAR: 0.1,
	CAMERA_FAR: 60000,
	BACKGROUND_RADIUS: 499
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metersToPx = metersToPx;
exports.getTransform = getTransform;
exports.parseMatrix = parseMatrix;
exports.parseCssVar = parseCssVar;
exports.parseCssUrl = parseCssUrl;
// export function toggleWebGLVisibility(target, mode, duration = 250, delay = 0) {

//   if (mode == 'show') {

//     // turn visibility true, then tween opacity to 1
//     target.visible = true;
//     new TWEEN.Tween(target.material)
//       .to({opacity: 1}, delay)
//       .delay(delay)
//       .start();

//   } else if (mode == 'hide') {

//     // tween to 0 then set visibility to false
//     new TWEEN.Tween(target.material)
//       .to({opacity: 0}, delay)
//       .delay(delay)
//       .onComplete(function(){
//         target.visible = false;
//       })
//       .start();
//   }
// }


// export function toggleCSSVisibility(target, mode, delay = 0) {

//   if (mode == 'show') {

//     if (delay > 0) {
//       window.setTimeout(() => {
//         target.style.visibility = 'visible';
//       }, delay);
//     } else {
//       target.style.visibility = 'visible';
//     }

//   } else if (mode == 'hide') {

//     if (delay > 0) {
//       window.setTimeout(() => {
//         target.style.visibility = 'hidden';
//       }, delay);
//     } else {
//       target.style.visibility = 'hidden';
//     }
//   }
// }

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

// export function toggleCSSOpacity(target) {

//   var el = document.querySelector(target);

//   if(el.style.opacity == '1') {
//     el.style.opacity = '0';
//     setTimeout( function(){ el.style.display = 'none' }, 100); 
//   } else {
//     el.style.display = 'block';
//     // Delay setting opacity, or opacity transition will not fire, due to https://bugs.chromium.org/p/chromium/issues/detail?id=121340
//     setTimeout( function(){ el.style.opacity = 1 }, 100); 
//   }
// }

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleSheets = function () {
  function StyleSheets() {
    _classCallCheck(this, StyleSheets);

    // get document stylesheets    
    this.sheets = document.styleSheets;

    // create a variable for the stylesheet with 'vr' title
    for (var i = 0; i < this.sheets.length; i++) {
      if (this.sheets[i].title === 'vr') {
        this.vr = this.sheets[i];
      }
    }

    // disable the vr stylesheet. It should only be active in certain display modes.
    this.setVRSheet('disable');
  }

  _createClass(StyleSheets, [{
    key: 'setVRSheet',
    value: function setVRSheet(mode) {
      if (mode == 'disable') {
        this.vr.disabled = true;
      } else if (mode == 'enable') {
        this.vr.disabled = false;
      }
    }
  }]);

  return StyleSheets;
}();

exports.default = StyleSheets;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(4);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
  new _app2.default();
}

window.onload = function () {
  init();
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _background = __webpack_require__(5);

var _background2 = _interopRequireDefault(_background);

var _camera = __webpack_require__(6);

var _camera2 = _interopRequireDefault(_camera);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _container = __webpack_require__(7);

var _container2 = _interopRequireDefault(_container);

var _css3dObjects = __webpack_require__(8);

var _css3dObjects2 = _interopRequireDefault(_css3dObjects);

var _cssRoot = __webpack_require__(10);

var _cssRoot2 = _interopRequireDefault(_cssRoot);

var _domWrapper = __webpack_require__(11);

var _domWrapper2 = _interopRequireDefault(_domWrapper);

var _events = __webpack_require__(12);

var _events2 = _interopRequireDefault(_events);

var _rendererCSS = __webpack_require__(13);

var _rendererCSS2 = _interopRequireDefault(_rendererCSS);

var _rendererGL = __webpack_require__(14);

var _rendererGL2 = _interopRequireDefault(_rendererGL);

var _state = __webpack_require__(15);

var _state2 = _interopRequireDefault(_state);

var _styleSheets = __webpack_require__(2);

var _styleSheets2 = _interopRequireDefault(_styleSheets);

var _webview = __webpack_require__(16);

var _webview2 = _interopRequireDefault(_webview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// app class instantiates and ties all of the components together, starts the loading process and renders the main loop
var App = function () {
  function App() {
    _classCallCheck(this, App);

    // create container element
    this.container = new _container2.default();

    // create scenes
    this.sceneGL = new THREE.Scene();
    this.sceneCSS = new THREE.Scene();

    // instantiate renderers
    this.rendererGL = new _rendererGL2.default(this.sceneGL, this.container.container);
    this.rendererCSS = new _rendererCSS2.default(this.sceneCSS, this.container.container);

    // instantiate camera
    this.camera = new _camera2.default(this.rendererGL.renderer);

    // instantiate cssRoot object (we add all CSS objects to this)
    this.cssRoot = new _cssRoot2.default(this.sceneCSS);

    // instantiate 'domWrapper': an element containing all the original HTML elements
    this.domWrapper = new _domWrapper2.default();

    // instantiate 'webview': simply the domWrapper converted to a CSS3D object, sized and positioned like a browser window in ChromeVR.
    this.webview = new _webview2.default(this.cssRoot, this.domWrapper);

    //instantiate styles
    this.styleSheets = new _styleSheets2.default();

    // instantiate CSS3D objects. Pass in cssRoot, webview and domWrapper. They're needed for setup purposes.
    this.stereoElements = new _css3dObjects2.default(this.cssRoot, this.webview, this.domWrapper, this.styleSheets); // array

    // instantiate backgrounds
    this.browserBackground = new _background2.default(this.sceneGL, 'images/environments/graygrid-360.png', 1);
    this.siteBackground = new _background2.default(this.sceneGL, 'images/environments/puydesancy.jpg', 0.9); // TODO: make this not hard-coded
    this.siteBackground.object.rotation.set(0, -1.57, 0);

    // instantiate state
    this.state = new _state2.default(this.styleSheets, this.stereoElements, this.siteBackground, this.webview);
    this.state.setDisplayMode('mobile');

    // instantiate events
    this.events = new _events2.default(this.camera, this.state);

    // start render loop
    this.render();
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      TWEEN.update();
      this.rendererGL.render(this.sceneGL, this.camera.camera);
      this.rendererCSS.render(this.sceneCSS, this.camera.camera);
      requestAnimationFrame(this.render.bind(this)); // bind the main class instead of window object
    }
  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Background = function () {
  function Background(scene, texture) {
    var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, Background);

    var geometry = new THREE.SphereGeometry(_config2.default.BACKGROUND_RADIUS, 64, 64);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-scale, scale, scale));

    this.object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      map: new THREE.TextureLoader().load(texture)
    }));
    this.object.rotation.set(0, -1.57, 0);
    scene.add(this.object);
  }

  _createClass(Background, [{
    key: 'hide',
    value: function hide() {
      this.object.visible = true;
      new TWEEN.Tween(this.object.material).to({ opacity: 1 }, 250).delay(250).start();
    }
  }, {
    key: 'show',
    value: function show() {
      new TWEEN.Tween(this.object.material).to({ opacity: 0 }, 250).onComplete(function () {
        this.object.visible = false;
      }.bind(this)).start();
    }
  }]);

  return Background;
}();

exports.default = Background;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Camera = function () {
  function Camera(renderer) {
    var _this = this;

    _classCallCheck(this, Camera);

    var width = renderer.domElement.width;
    var height = renderer.domElement.height;
    this.camera = new THREE.PerspectiveCamera(_config2.default.CAMERA_FOV, width / height, _config2.default.CAMERA_NEAR, _config2.default.CAMERA_FAR);
    this.camera.scale.set(0.01, 0.01, 0.01);
    this.updateSize(renderer);
    window.addEventListener('resize', function () {
      return _this.updateSize(renderer);
    }, false);
  }

  _createClass(Camera, [{
    key: 'updateSize',
    value: function updateSize(renderer) {
      this.camera.aspect = renderer.domElement.width / renderer.domElement.height;
      this.camera.updateProjectionMatrix();
    }

    // the following are camera animations

  }, {
    key: 'lookAroundEdgesOfWebview',
    value: function lookAroundEdgesOfWebview() {
      // camera.updateProjectionMatrix();
      var tweenA = new TWEEN.Tween(this.camera.rotation).to({ y: 1 }, 1250).easing(TWEEN.Easing.Quadratic.Out);

      var tweenB = new TWEEN.Tween(this.camera.rotation).to({ y: -1 }, 3000).easing(TWEEN.Easing.Quadratic.InOut);

      var tweenC = new TWEEN.Tween(this.camera.rotation).to({ y: 0 }, 1500).easing(TWEEN.Easing.Quadratic.InOut);

      tweenA.chain(tweenB);
      tweenB.chain(tweenC);
      tweenA.start();
    }
  }, {
    key: 'lookSideToSide',
    value: function lookSideToSide() {

      var tweenA = new TWEEN.Tween(this.camera.rotation).to({ x: .1, y: .4 }, 1000).easing(TWEEN.Easing.Quadratic.InOut);

      var tweenB = new TWEEN.Tween(this.camera.rotation).to({ x: .05, y: -.7 }, 1600).easing(TWEEN.Easing.Quadratic.InOut);

      var tweenC = new TWEEN.Tween(this.camera.rotation).to({ x: -0.03, y: 0.04 }, 1700).easing(TWEEN.Easing.Quadratic.InOut);

      var tweenD = new TWEEN.Tween(this.camera.rotation).to({ x: 0, y: 0 }, 600).easing(TWEEN.Easing.Quadratic.InOut);

      tweenA.chain(tweenB);
      tweenB.chain(tweenC);
      tweenC.chain(tweenD);
      tweenA.start();
    }
  }, {
    key: 'panSideToSide',
    value: function panSideToSide() {

      var tweenA = new TWEEN.Tween(this.camera.position).to({ x: 1 }, 1250).easing(TWEEN.Easing.Quadratic.Out);

      var tweenB = new TWEEN.Tween(this.camera.position).to({ x: -1 }, 3000).easing(TWEEN.Easing.Quadratic.InOut);

      var tweenC = new TWEEN.Tween(this.camera.position).to({ x: 0 }, 1500).easing(TWEEN.Easing.Quadratic.InOut);

      tweenA.chain(tweenB);
      tweenB.chain(tweenC);
      tweenA.start();
    }
  }]);

  return Camera;
}();

exports.default = Camera;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function Container() {
  _classCallCheck(this, Container);

  // the container element will contain our Three.js renderers
  this.container = document.createElement('div');
  this.container.id = 'container';
  this.container.style.position = 'absolute';
  this.container.style.width = '100%';
  this.container.style.height = '100vh';
  this.container.style.top = this.container.style.left = 0;
  document.body.appendChild(this.container);
};

exports.default = Container;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _css3dObject = __webpack_require__(9);

var _css3dObject2 = _interopRequireDefault(_css3dObject);

var _utilities = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Css3dObjects = function () {
  function Css3dObjects(cssRoot, webview, domWrapper, styleSheets) {
    _classCallCheck(this, Css3dObjects);

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
      this.transformStyle = (0, _utilities.parseCssVar)(this.element, '--transform-style');
      this.transform = (0, _utilities.parseCssVar)(this.element, 'transform');

      // It's not enough to check for --transform-style: stereo, because we get false positives on children, which inherit it from parent.
      // We can get the precision we need by also checking if they have transforms.
      // TODO: This is obviously error prone, since some elements that are children of a 'stereo' parent could indeed have transforms, but it works for now.
      if (this.transformStyle == 'stereo' && this.transform !== 'none') {

        // for each element that matches the criteria, create a css3dObject instance and push it to the stereoElements array.
        this.css3dObject = new _css3dObject2.default(cssRoot, webview, this.element);
        this.stereoElements.push(this.css3dObject);
      }
    }

    // turn off the vr stylesheet. We don't want it active and adjusting layout until we're in VR mode.
    styleSheets.setVRSheet('disable');
  }

  // for each css3dObject instance in stereoElements array, call it's animate function
  // 'mode' is either 'hide' or 'show'.


  _createClass(Css3dObjects, [{
    key: 'animate',
    value: function animate(mode, duration) {

      this.stereoElements.forEach(function (e) {
        e.animate(mode, duration);
      });
    }
  }]);

  return Css3dObjects;
}();

exports.default = Css3dObjects;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilities = __webpack_require__(1);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Css3dObject = function () {
  function Css3dObject(cssRoot, webview, element) {
    _classCallCheck(this, Css3dObject);

    // get element and id
    this.element = element;
    this.id = this.element.id;

    // get coordinate space from css.
    this.coordinateSpace = (0, _utilities.parseCssVar)(this.element, '--position');

    // assign 'window' if undefined (thereby making 'window' the default).
    if (!this.coordinateSpace) {
      this.coordinateSpace = 'window';
    };

    // get starting values
    this.startWidth = parseInt(window.getComputedStyle(this.element).getPropertyValue('width'));
    this.startHeight = parseInt(window.getComputedStyle(this.element).getPropertyValue('height'));
    this.startX = this.element.offsetLeft;
    this.startY = this.element.offsetTop;
    this.startZ;

    // store original element (VR) values
    this.targetScaleX = (0, _utilities.getTransform)(this.element).scale.x;
    this.targetScaleY = (0, _utilities.getTransform)(this.element).scale.y;

    // clone the original element:
    // the clone stays in the position in page flow, and the original element is turned into a CSS3D object.
    // this preserves the original layout during the transition by avoiding reflows created when original element is positioned absolute.
    // original element also retains it's event listeners.
    this.clone = this.element.cloneNode(true);
    this.element.parentElement.insertBefore(this.clone, this.element);

    // if the original element is position:absolute, zero out position values and change to relative, before converting to a CSS3DObject.
    // this helps ensure that it's 'after' position matches it's 'before'.
    if (window.getComputedStyle(this.element).getPropertyValue('position') == 'absolute') {
      this.element.style.top = this.element.style.bottom = this.element.style.left = this.element.style.right = 0;
      this.element.style.position = 'relative';
    }

    // make a CSS3DObject of the element
    this.object = new THREE.CSS3DObject(this.element);

    // some coordinates depend on whether the object is in the 'world' or 'window' coordinate space
    if (this.coordinateSpace == 'world') {

      // position models at the values specific by their transforms. These are in the 'world' coordinate space (world being cssRoot); not relative to the window.
      this.object.position.x = (0, _utilities.getTransform)(element).translate.x;
      this.object.position.y = (0, _utilities.getTransform)(element).translate.y;
      this.object.position.z = (0, _utilities.getTransform)(element).translate.z;

      // capturing 'target' values for objects in 'world' coordinate space isn't as useful, since they don't animate positions when displayMode changes, but we grab them anyways.
      this.targetTransformX = object.position.x;
      this.targetTransformY = object.position.y;
      this.targetTransformZ = object.position.z;

      // add the CSS3Oobject to the cssRoot
      cssRoot.add(this.object);
    } else if (this.coordinateSpace == 'window') {

      // match this object's position/rotation to the original target element
      this.object.position.x = this.startX + this.startWidth / 2 - (0, _utilities.metersToPx)(_config2.default.WEBVIEW_WIDTH) / 2;
      this.object.position.y = -this.startY - this.startHeight / 2 + (0, _utilities.metersToPx)(_config2.default.WEBVIEW_HEIGHT) / 2;
      this.object.position.z = 0.0001;

      // capture these values as the 'start' values. We'll use these to drive animations.
      this.startX = this.object.position.x;
      this.startY = this.object.position.y;
      this.startZ = this.object.position.z;

      // set 'target' values. In 'window' mode, transforms are relative to original element position, so we add the transform values to the original values.
      this.targetTransformX = this.object.position.x + (0, _utilities.getTransform)(this.element).translate.x;
      this.targetTransformY = this.object.position.y + (0, _utilities.getTransform)(this.element).translate.y;
      this.targetTransformZ = (0, _utilities.getTransform)(this.element).translate.z;

      // add the CSS3Oobject to the webview object, so positions are relative
      webview.object.add(this.object);
    }

    this.element.style.visibility = 'hidden'; // hide the CSS3DObject to start (by setting visibility style of the original element)
  }

  _createClass(Css3dObject, [{
    key: 'animate',
    value: function animate(mode) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;


      var tranX = void 0,
          tranY = void 0,
          tranZ = void 0,
          scaleX = void 0,
          scaleY = void 0,
          delay = void 0;

      // animate to new position, scale, rotation
      if (this.coordinateSpace == 'window') {

        if (mode == 'show') {

          this.element.style.visibility = 'visible';
          this.clone.style.visibility = 'hidden';
          tranX = this.targetTransformX;
          tranY = this.targetTransformY;
          tranZ = this.targetTransformZ;
          scaleX = this.targetScaleX;
          scaleY = this.targetScaleY;
        } else if (mode == 'hide') {

          delay = duration;
          this.hide(this.element, delay); // wait until position tweens complete to hide the CSS3D versions.
          this.show(this.clone, delay); // wait until position tweens complete to show the inline ("clone") versions. This makes transition seamless.
          tranX = this.startX;
          tranY = this.startY;
          tranZ = this.startZ;
          scaleX = 1;
          scaleY = 1;
        }

        if (tranX) {
          new TWEEN.Tween(this.object.position).to({ x: tranX }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        }

        if (tranY) {
          new TWEEN.Tween(this.object.position).to({ y: tranY }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        }

        if (tranZ) {
          new TWEEN.Tween(this.object.position).to({ z: tranZ }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        }

        if (scaleX) {
          new TWEEN.Tween(this.object.scale).to({ x: scaleX }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        }

        if (scaleY) {
          new TWEEN.Tween(this.object.scale).to({ y: scaleY }, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
        }
      }
    }
  }, {
    key: 'hide',
    value: function hide(target) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (delay > 0) {
        window.setTimeout(function () {
          target.style.visibility = 'hidden';
        }, delay);
      } else {
        target.style.visibility = 'hidden';
      }
    }
  }, {
    key: 'show',
    value: function show(target) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (delay > 0) {
        window.setTimeout(function () {
          target.style.visibility = 'visible';
        }, delay);
      } else {
        target.style.visibility = 'visible';
      }
    }
  }]);

  return Css3dObject;
}();

exports.default = Css3dObject;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CssRoot = function CssRoot(scene) {
  _classCallCheck(this, CssRoot);

  // Setup cssRoot and scale by 0.001. We do this to adjust CSS px values into meters.
  // All subsequent CSS objects are added to cssRoot.
  this.cssRoot = new THREE.Object3D();
  this.cssRoot.scale.set(0.001, 0.001, 0.001);
  scene.add(this.cssRoot);
  return this.cssRoot;
};

exports.default = CssRoot;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _styleSheets = __webpack_require__(2);

var _styleSheets2 = _interopRequireDefault(_styleSheets);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomWrapper = function DomWrapper() {
  _classCallCheck(this, DomWrapper);

  //get stylesheets
  this.styleSheets = new _styleSheets2.default();

  //move html elements into a wrapper element
  this.domWrapper = document.createElement('div');
  this.domWrapper.id = 'domWrapper';
  this.domWrapper.style.width = String(_config2.default.WEBVIEW_WIDTH * 1000) + 'px';
  this.domWrapper.style.height = String(_config2.default.WEBVIEW_HEIGHT * 1000) + 'px';
  this.domWrapper.style.position = 'relative';
  this.domWrapper.style.overflow = 'scroll';
  this.domWrapper.style.borderRadius = '8px';
  this.domWrapper.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0.1)';
  this.domWrapper.style.transition = 'box-shadow 0.5s east-out';
  document.body.appendChild(this.domWrapper);

  // Move page elements into the domWrapper element
  while (document.body.children.length > 2) {
    var el = document.body.children[0];
    if (el.id != 'domWrapper' && el.id != 'container') {
      this.domWrapper.appendChild(document.body.children[0]);
    }
  }

  return this.domWrapper;
};

exports.default = DomWrapper;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function Events(camera, state) {
  _classCallCheck(this, Events);

  window.addEventListener('keydown', function (e) {

    var handled = false;

    // check if meta or ctrl keys are pressed. If not, proceed. Ensures keyboard shortcuts work properly on Mac & Windows.
    if (!e.metaKey || !e.metaKey) {

      switch (e.keyCode) {
        case 49:
          {
            // 1
            state.setDisplayMode('mobile');
            handled = true;
            break;
          }
        case 50:
          {
            // 2
            state.setDisplayMode('vr-fullscreen');
            handled = true;
            break;
          }
        case 51:
          {
            // 3
            state.setDisplayMode('vr-windowed');
            handled = true;
            break;
          }
        case 52:
          {
            // 4
            camera.lookAroundEdgesOfWebview();
            handled = true;
            break;
          }
        case 53:
          {
            // 5
            camera.lookSideToSide();
            handled = true;
            break;
          }
        case 54:
          {
            // 6
            camera.panSideToSide();
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
};

exports.default = Events;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RendererCSS = function () {
  function RendererCSS(scene, container) {
    var _this = this;

    _classCallCheck(this, RendererCSS);

    this.scene = scene;
    this.container = container;
    this.renderer = new THREE.CSS3DRenderer();
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    container.appendChild(this.renderer.domElement);

    this.updateSize();
    document.addEventListener('DOMContentLoaded', function () {
      return _this.updateSize();
    }, false);
    window.addEventListener('resize', function () {
      return _this.updateSize();
    }, false);
  }

  _createClass(RendererCSS, [{
    key: 'updateSize',
    value: function updateSize() {
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }
  }, {
    key: 'render',
    value: function render(scene, camera) {
      this.renderer.render(scene, camera);
    }
  }]);

  return RendererCSS;
}();

exports.default = RendererCSS;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RendererGL = function () {
  function RendererGL(scene, container) {
    var _this = this;

    _classCallCheck(this, RendererGL);

    this.scene = scene;
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    container.appendChild(this.renderer.domElement);

    this.updateSize();
    document.addEventListener('DOMContentLoaded', function () {
      return _this.updateSize();
    }, false);
    window.addEventListener('resize', function () {
      return _this.updateSize();
    }, false);
  }

  _createClass(RendererGL, [{
    key: 'updateSize',
    value: function updateSize() {
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }
  }, {
    key: 'render',
    value: function render(scene, camera) {
      this.renderer.render(scene, camera);
    }
  }]);

  return RendererGL;
}();

exports.default = RendererGL;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = function () {
  function State(styleSheets, stereoElements, siteBackground, webview) {
    _classCallCheck(this, State);

    this.currentDisplayMode;
    this.styleSheets = styleSheets;
    this.stereoElements = stereoElements;
    this.siteBackground = siteBackground;
    this.webview = webview;
  }

  _createClass(State, [{
    key: 'setDisplayMode',
    value: function setDisplayMode(targetMode) {
      if (targetMode == 'mobile' && this.currentDisplayMode != 'mobile') {

        this.webview.showShadows();
        this.siteBackground.show();
        this.stereoElements.animate('hide');
        this.styleSheets.setVRSheet('disable');
        this.currentDisplayMode = targetMode;
      } else if (targetMode == 'vr-fullscreen' && this.currentDisplayMode != 'vr-fullscreen') {

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
  }]);

  return State;
}();

exports.default = State;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _utilities = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebView = function () {
  function WebView(cssRoot, domWrapper) {
    _classCallCheck(this, WebView);

    // Turn the domWrapper into a CSS3DObject and set position
    this.object = new THREE.CSS3DObject(domWrapper);
    this.object.position.z = (0, _utilities.metersToPx)(-_config2.default.WEBVIEW_DISTANCE);
    this.object.scale.set(_config2.default.WEBVIEW_DISTANCE, _config2.default.WEBVIEW_DISTANCE, _config2.default.WEBVIEW_DISTANCE);

    cssRoot.add(this.object);
  }

  _createClass(WebView, [{
    key: 'hideShadows',
    value: function hideShadows() {
      domWrapper.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0)';
      // new TWEEN.Tween(webviewShadow.material)
      //   .to({opacity: 0}, 500)
      //   .start();
    }
  }, {
    key: 'showShadows',
    value: function showShadows() {
      domWrapper.style.boxShadow = '0px 0px 80px 0px rgba(0,0,0,0)';
      // new TWEEN.Tween(webviewShadow.material)
      //   .to({opacity: 0}, 500)
      //   .start();
    }
  }]);

  return WebView;
}();

exports.default = WebView;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map