export default class Lights {
  constructor(scene) {

    this.light = new THREE.HemisphereLight( 0xffffff, 0xB0B0B0, 1.2 );
    scene.add(this.light);
  }
}