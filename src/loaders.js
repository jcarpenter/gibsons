import { parseCssUrl } from './utilities';

export const loaderGLTF = new THREE.GLTF2Loader();
export const loaderOBJ = new THREE.OBJLoader2();

// export function loadGLTF(src) {
  
//   // get URL of texture from CSS custom property
//   // const model_url = parseCssUrl(document.querySelector(element), customProp);

//   // load url
//   loaderGLTF.load( src, function ( gltf ) {
//     // sceneGL.add( gltf.scene );

//     gltf.animations; // Array: THREE.AnimationClip
//     gltf.scene;      // THREE.Scene
//     gltf.scenes;     // Array: THREE.Scene
//     gltf.cameras;    // Array: THREE.Camera

//     // gltf.scene.position.set(0, 0, -4);
//     return gltf;
//     console.log(gltf);

//   } );
// }

export function loadOBJ(element, customProp) {
  
  // get URL of texture from CSS custom property
  const model_url = parseCssUrl(document.querySelector(element), customProp);

  // load url
  loaderOBJ.load( model_url, function ( obj ) {
    // sceneGL.add( obj );
    return obj
  });
}
/*
export function addLights() {
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 1000, 100 );
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  sceneGL.add( spotLight );
}
*/