'use strict'

var sceneGL, sceneCSS, rendererGL, rendererCSS;
var camera;
var webview, webviewRoot, container;


function init() {

  // Create "webview" element
  // We use this to wrap our page elements and pass to Three.js CSSRenderer
  webview = document.createElement("div");
  webview.id = "webview";
	webview.style.width = '960px';
  webview.style.height = '640px';
  webview.style.overflow = 'hidden';
  webview.style.borderRadius = '8px';
  document.body.appendChild(webview);

  // Move page elements into the webview element
  while (document.body.children.length > 1) {
    if (document.body.children[0].id != "webview") {
      webview.appendChild(document.body.children[0]);
    }
  }

  // Setup scenes
  sceneGL = new THREE.Scene();
  sceneCSS = new THREE.Scene();

  //Setup renderers
  rendererGL = new THREE.WebGLRenderer({antialias: true, alpha: true});
  rendererGL.setSize(window.innerWidth, window.innerHeight);
  rendererGL.domElement.style.position = 'absolute';
  rendererGL.domElement.style.top = 0;
  document.body.appendChild(rendererGL.domElement);
  
  rendererCSS = new THREE.CSS3DRenderer();
  rendererCSS.setSize(window.innerWidth, window.innerHeight);
  rendererCSS.domElement.style.position = 'absolute';
  rendererCSS.domElement.style.top = 0;
  rendererCSS.domElement.style.left = 0;
  document.body.appendChild( rendererCSS.domElement );
  
  // Setup camera
  camera = new THREE.PerspectiveCamera(80, 0.75, 1, 120000);
  sceneGL.add( camera );

  //Setup background sphere
  var bg_geometry = new THREE.SphereGeometry(1000, 64, 64);
  bg_geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

  var bg1 = new THREE.Mesh(
	  bg_geometry,
	  new THREE.MeshBasicMaterial({ 
	    shading: THREE.FlatShading,
	    map: new THREE.TextureLoader().load( 'images/environments/graygrid-360.png')
	  })
  );
  bg1.rotation.set( 0, -1.57, 0);
  sceneGL.add(bg1);

  //Setup webview
  var webviewObj = new THREE.CSS3DObject(webview);
  webviewObj.scale.set(.001, .001, .001);
  webviewObj.position.z = -1;
  // webviewRoot = new THREE.Group();
  sceneCSS.add(webviewObj);

  // Start scene
  onWindowResize();
  animate();
  setTimeout(function(){

    var tweenA = new TWEEN.Tween( camera.rotation )
      .to({ x: .1, y: .4 }, 1000 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    var tweenB = new TWEEN.Tween( camera.rotation )
      .to({ x: .05, y: -.7 }, 1600 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    var tweenC = new TWEEN.Tween( camera.rotation )
      .to({ x: -0.03, y: 0.04 }, 1700 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    var tweenD = new TWEEN.Tween( camera.rotation )
      .to({ x: 0, y: 0 }, 600 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    tweenA.chain(tweenB);
    tweenB.chain(tweenC);
    tweenC.chain(tweenD);
    tweenA.start();
    console.log("Trr")

  }, 2000);
}

/* ----- EVENT LISTENERS ----- */

window.addEventListener('resize', onWindowResize, false );


/* ----- WINDOW RESIZES ----- */

function onWindowResize() {

  var w = window.innerWidth
  var h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  rendererGL.setSize( w, h );
  rendererCSS.setSize( w, h );

}

function animate() {

  requestAnimationFrame( animate );
  TWEEN.update();

  rendererGL.render( sceneGL, camera );
  rendererCSS.render( sceneCSS, camera );

}

/* ----- START SCENE ----- */

window.onload = function() {
  init();
}