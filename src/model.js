import Config from './config';
import {loaderGLTF} from './loaders';
import {getTransform, parseCssVar, pxToMeters} from './utilities';{}

export default class Model {
  constructor(sceneFar, sceneNear, element) {

    this.group = new THREE.Group();
    this.gltf;
    this.src = element.getAttribute('src');
    this.coordinateSystem = parseCssVar(element, '--position');
    this.transform = getTransform(element);

    // add to either far or near scenes, depending on whether CSS Z transform is closer or further than webview.
    if(pxToMeters(this.transform.translate.z) < -Config.WEBVIEW_DISTANCE) {
      sceneFar.add(this.group);
    } else {
      sceneNear.add(this.group);
    }

    loaderGLTF.load(this.src, gltf => {

      this.gltf = gltf.scene;

      gltf.scene.position.set(
        pxToMeters(this.transform.translate.x),
        pxToMeters(this.transform.translate.y),
        pxToMeters(this.transform.translate.z)
      );

      gltf.scene.scale.set(
        this.transform.scale.x,
        this.transform.scale.y,
        this.transform.scale.z
      );

      // console.log(this.transform.scale.x, this.transform.scale.y, this.transform.scale.z);
      this.group.add(this.gltf)
    })
  }

  hide() {  
    this.group.visible = false;
  }

  show() {
    this.group.visible = true;
  }
}