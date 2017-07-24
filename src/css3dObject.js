import {
  toggleWebGLVisibility,
  toggleCSSVisibility,
  toggleWebviewShadows,
  metersToPx,
  getTransform,
  parseMatrix,
  parseCssVar,
  parseCssUrl
} from './utilities';

import Config from './config';

export default class Css3dObject {
  constructor(cssRoot, webview, element) {

    // get element and id
    this.element = element;
    this.id = this.element.id;

    // get coordinate space from css.
    this.coordinateSpace = parseCssVar(this.element, '--position');

    // assign 'window' if undefined (thereby making 'window' the default).
    if(!this.coordinateSpace) { this.coordinateSpace = 'window' };

    // get starting values
    this.startWidth = parseInt(window.getComputedStyle(this.element).getPropertyValue('width'));
    this.startHeight = parseInt(window.getComputedStyle(this.element).getPropertyValue('height'));
    this.startX = this.element.offsetLeft;
    this.startY = this.element.offsetTop;
    this.startZ;

    // store original element (VR) values
    this.targetScaleX = getTransform(this.element).scale.x;
    this.targetScaleY = getTransform(this.element).scale.y;

    // clone the original element:
    // the clone stays in the position in page flow, and the original element is turned into a CSS3D object.
    // this preserves the original layout during the transition by avoiding reflows created when original element is positioned absolute.
    // original element also retains it's event listeners.
    this.clone = this.element.cloneNode(true);
    this.element.parentElement.insertBefore( this.clone, this.element );

    // if the original element is position:absolute, zero out position values and change to relative, before converting to a CSS3DObject.
    // this helps ensure that it's 'after' position matches it's 'before'.
    if ( window.getComputedStyle(this.element).getPropertyValue('position') == 'absolute' ) {
      this.element.style.top = this.element.style.bottom = this.element.style.left = this.element.style.right = 0;
      this.element.style.position = 'relative';
    } 

    // make a CSS3DObject of the element
    this.object = new THREE.CSS3DObject(this.element);

    // some coordinates depend on whether the object is in the 'world' or 'window' coordinate space
    if (this.coordinateSpace == 'world') {

      // position models at the values specific by their transforms. These are in the 'world' coordinate space (world being cssRoot); not relative to the window.
      this.object.position.x = getTransform(element).translate.x;
      this.object.position.y = getTransform(element).translate.y;
      this.object.position.z = getTransform(element).translate.z;

      // capturing 'target' values for objects in 'world' coordinate space isn't as useful, since they don't animate positions when displayMode changes, but we grab them anyways.
      this.targetTransformX = object.position.x
      this.targetTransformY = object.position.y
      this.targetTransformZ = object.position.z

      // add the CSS3Oobject to the cssRoot
      cssRoot.add(this.object);    

    } else if (this.coordinateSpace == 'window') {
      
      // match this object's position/rotation to the original target element
      this.object.position.x = this.startX + this.startWidth / 2 - metersToPx(Config.WEBVIEW_WIDTH) / 2;
      this.object.position.y = -this.startY - this.startHeight / 2 + metersToPx(Config.WEBVIEW_HEIGHT) / 2;
      this.object.position.z = 0.0001;

      // capture these values as the 'start' values. We'll use these to drive animations.
      this.startX = this.object.position.x;
      this.startY = this.object.position.y;
      this.startZ = this.object.position.z;

      // set 'target' values. In 'window' mode, transforms are relative to original element position, so we add the transform values to the original values.
      this.targetTransformX = this.object.position.x + getTransform(this.element).translate.x;
      this.targetTransformY = this.object.position.y + getTransform(this.element).translate.y;
      this.targetTransformZ = getTransform(this.element).translate.z;

      // add the CSS3Oobject to the webview object, so positions are relative
      webview.object.add(this.object);
    }


    this.element.style.visibility = 'hidden'; // hide the CSS3DObject to start (by setting visibility style of the original element)

  }

  animate(mode, duration = 250) {

    let tranX, tranY, tranZ, scaleX, scaleY, delay;

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

      if(tranX) {
        new TWEEN.Tween(this.object.position)
          .to({x: tranX}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(tranY) {
        new TWEEN.Tween(this.object.position)
          .to({y: tranY}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(tranZ) {
        new TWEEN.Tween(this.object.position)
          .to({z: tranZ}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(scaleX) {
        new TWEEN.Tween(this.object.scale)
          .to({x: scaleX}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }

      if(scaleY) {
        new TWEEN.Tween(this.object.scale)
          .to({y: scaleY}, duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
      }
    }
  }

  hide(target, delay = 0) {
    if (delay > 0) {
      window.setTimeout(() => {
        target.style.visibility = 'hidden';
      }, delay);
    } else {
      target.style.visibility = 'hidden';
    }
  }

  show(target, delay = 0) {
    if (delay > 0) {
      window.setTimeout(() => {
        target.style.visibility = 'visible';
      }, delay);
    } else {
      target.style.visibility = 'visible';
    }
  }
}