export default class Grid {
  constructor(scene) {

    this.object = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({
        transparent: true,
        shading: THREE.FlatShading,
        map: new THREE.TextureLoader().load('images/environments/gray-grid.png')
      })
    )
    this.object.rotation.set(-1.57, 0, 0);
    this.object.position.set(0, -1.7, 0);
    scene.add(this.object);
  }

  hide() {
    new TWEEN.Tween(this.object.material)
      .to({opacity: 0}, 250)
      .onComplete(function(){
        this.object.visible = false;
      }.bind(this))
      .start();
  }

  show() {
    this.object.visible = true;
    new TWEEN.Tween(this.object.material)
      .to({opacity: 1}, 250)
      .delay(250)
      .start();
  }
}