export default class CssRoot {
  constructor(scene) {

    // Setup cssRoot and scale by 0.001. We do this to adjust CSS px values into meters.
    // All subsequent CSS objects are added to cssRoot.
    this.cssRoot = new THREE.Object3D();
    this.cssRoot.scale.set(0.001, 0.001, 0.001); 
    scene.add(this.cssRoot);
    return this.cssRoot;
  }
}