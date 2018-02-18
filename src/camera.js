import Config from './config'

export default class Camera {
  constructor(renderer, webview) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    this.camera = new THREE.PerspectiveCamera(Config.CAMERA_FOV, width / height, Config.CAMERA_NEAR, Config.CAMERA_FAR);
    this.camera.scale.set(0.1, 0.1, 0.1);
    this.lookAt = true; // boolean that sets whether camera should look at a target. Is checked per frame by render loop in App. Wish there was a better way.
    this.lookAtTarget = new THREE.Vector3(0, 0, -Config.WEBVIEW_DISTANCE);
    this.updateSize(renderer);
    window.addEventListener('resize', () => this.updateSize(renderer), false);
  }

  updateSize(renderer) {
    this.camera.aspect = renderer.domElement.width / renderer.domElement.height;
    this.camera.updateProjectionMatrix();
  }

  // camera animations

  lookAroundEdgesOfWebview() {
    
    this.lookAt = true;
    let tweenA = new TWEEN.Tween( this.camera.position )
      .to({ x: 1 }, 1250 )
      .easing(TWEEN.Easing.Quadratic.Out)

    let tweenB = new TWEEN.Tween( this.camera.position )
      .to({ x: -1 }, 3000 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    let tweenC = new TWEEN.Tween( this.camera.position )
      .to({ x: 0 }, 1500 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    tweenA.chain(tweenB);
    tweenB.chain(tweenC);
    tweenA.start();
  }

  lookSideToSide() {

    this.lookAt = false;
    let tweenA = new TWEEN.Tween( this.camera.rotation )
      .to({ x: .1, y: .4 }, 1000 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    let tweenB = new TWEEN.Tween( this.camera.rotation )
      .to({ x: .05, y: -.7 }, 1600 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    let tweenC = new TWEEN.Tween( this.camera.rotation )
      .to({ x: -0.03, y: 0.04 }, 1700 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    let tweenD = new TWEEN.Tween( this.camera.rotation )
      .to({ x: 0, y: 0 }, 600 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    tweenA.chain(tweenB);
    tweenB.chain(tweenC);
    tweenC.chain(tweenD);
    tweenA.start();
  }

  panSideToSide() {

    this.lookAt = false;
    let tweenA = new TWEEN.Tween( this.camera.position )
      .to({ x: 1 }, 1250 )
      .easing(TWEEN.Easing.Quadratic.Out)

    let tweenB = new TWEEN.Tween( this.camera.position )
      .to({ x: -1 }, 3000 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    let tweenC = new TWEEN.Tween( this.camera.position )
      .to({ x: 0 }, 1500 )
      .easing(TWEEN.Easing.Quadratic.InOut)

    tweenA.chain(tweenB);
    tweenB.chain(tweenC);
    tweenA.start();
  }

  orthographic() {

    this.lookAt = true;

    new TWEEN.Tween( this.camera )
      .to({ fov: 6 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    new TWEEN.Tween( this.camera.position )
      .to({ x: 30, y: 30, z: 30 }, 1250 )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

  }
}