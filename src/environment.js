import Model from './model';
import {loaderGLTF} from './loaders';
import {parseCssUrl} from './utilities';

export default class Environment {
  constructor(sceneFar, styleSheets) {
    
    // check for environment CSS value
    // if exists, create Model instance, set to default scale and position.

    // turn on vr stylesheet so we can parse it's values. We'll turn it off at the end of this function.
    styleSheets.setVRSheet('enable');

    this.group = new THREE.Group();
    this.gltf;
    this.src = parseCssUrl(document.body, '--environment');
    sceneFar.add(this.group);

    if (this.src) {

      loaderGLTF.load(this.src, gltf => {

        this.gltf = gltf.scene;

        // gltf.scene.position.set(
        //   pxToMeters(this.transform.translate.x),
        //   pxToMeters(this.transform.translate.y),
        //   pxToMeters(this.transform.translate.z)
        // );

        // gltf.scene.scale.set(
        //   this.transform.scale.x,
        //   this.transform.scale.y,
        //   this.transform.scale.z
        // );

        this.group.add(this.gltf);
      })
    }

    // turn off the vr stylesheet. We don't want it active and adjusting layout until we're in VR mode.
    styleSheets.setVRSheet('disable');

  }

  hide() {
    this.group.visible = false;
  }

  show() {
    this.group.visible = true;
  }
}