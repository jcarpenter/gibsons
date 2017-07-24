import Config from './config';

export default class Background {
  constructor(scene, texture, scale = 1) {

    const geometry = new THREE.SphereGeometry(Config.BACKGROUND_RADIUS, 64, 64);
    geometry.applyMatrix(new THREE.Matrix4().makeScale( -scale, scale, scale ));

    this.object = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ 
        shading: THREE.FlatShading,
        map: new THREE.TextureLoader().load(texture)
      })
    );
    this.object.rotation.set( 0, -1.57, 0);
    scene.add(this.object);
  }

  hide() {
    this.object.visible = true;
    new TWEEN.Tween(this.object.material)
      .to({opacity: 1}, 250)
      .delay(250)
      .start();
  }

  show() {
    new TWEEN.Tween(this.object.material)
      .to({opacity: 0}, 250)
      .onComplete(function(){
        this.object.visible = false;
      }.bind(this))
      .start();
  }
}