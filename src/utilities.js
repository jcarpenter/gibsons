// export function toggleWebGLVisibility(target, mode, duration = 250, delay = 0) {

//   if (mode == 'show') {

//     // turn visibility true, then tween opacity to 1
//     target.visible = true;
//     new TWEEN.Tween(target.material)
//       .to({opacity: 1}, delay)
//       .delay(delay)
//       .start();

//   } else if (mode == 'hide') {

//     // tween to 0 then set visibility to false
//     new TWEEN.Tween(target.material)
//       .to({opacity: 0}, delay)
//       .delay(delay)
//       .onComplete(function(){
//         target.visible = false;
//       })
//       .start();
//   }
// }


// export function toggleCSSVisibility(target, mode, delay = 0) {

//   if (mode == 'show') {

//     if (delay > 0) {
//       window.setTimeout(() => {
//         target.style.visibility = 'visible';
//       }, delay);
//     } else {
//       target.style.visibility = 'visible';
//     }

//   } else if (mode == 'hide') {

//     if (delay > 0) {
//       window.setTimeout(() => {
//         target.style.visibility = 'hidden';
//       }, delay);
//     } else {
//       target.style.visibility = 'hidden';
//     }
//   }
// }

export function metersToPx(meters) {
  return meters * 1000;
}

export function pxToMeters(px) {
  return px / 1000;
}


// getTransform and parseMatrix functions taken from Keith Clark:
// http://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/
export function getTransform (element) {
    var matrix = parseMatrix(getComputedStyle(element, null).transform),
        rotateY = Math.asin(-matrix.m13),
        rotateX, 
        rotateZ;

    if (Math.cos(rotateY) !== 0) {
        rotateX = Math.atan2(matrix.m23, matrix.m33);
        rotateZ = Math.atan2(matrix.m12, matrix.m11);
    } else {
        rotateX = Math.atan2(-matrix.m31, matrix.m22);
        rotateZ = 0;
    }
    return {
        rotate: { x: rotateX, y: rotateY, z: rotateZ },
        translate: { x: matrix.m41, y: matrix.m42, z: matrix.m43 },
        scale: { x: matrix.m11, y: matrix.m22, z: matrix.m33  }
    };
}


export function parseMatrix (matrixString) {
  var c = matrixString.split(/\s*[(),]\s*/).slice(1,-1),
    matrix;
  if (c.length === 6) {
    // 'matrix()' (3x2)
    matrix = {
        m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
        m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
        m13: 0,     m23: 0,     m33: 1, m43: 0,
        m14: 0,     m24: 0,     m34: 0, m44: 1
    };
  } else if (c.length === 16) {
    // matrix3d() (4x4)
    matrix = {
        m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
        m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
        m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
        m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
    };
  } else {
    // handle 'none' or invalid values.
    matrix = {
        m11: 1, m21: 0, m31: 0, m41: 0,
        m12: 0, m22: 1, m32: 0, m42: 0,
        m13: 0, m23: 0, m33: 1, m43: 0,
        m14: 0, m24: 0, m34: 0, m44: 1
    };
  }
  return matrix;
}


// TODO: Combined into a single generic function that can tell whether property value is a url().
// For now I need to know ahead of time the CSS value so I know which function to call.
export function parseCssVar(element, varName){
  const elementStyles = window.getComputedStyle(element);
  return elementStyles.getPropertyValue(varName).trim();
}


export function parseCssUrl(element, varName){
  const css_url = window.getComputedStyle(element).getPropertyValue(varName);
  
  if (!css_url) { // if no custom property found...
    console.log('Could not find custom property named: ' + varName);
  } else { // if property found...
  
    // Grabbed from: gist.github.com/eligrey/1129978
    var
        uri = css_url.match(/^\s*url\(\s*(.*)\s*\)\s*$/)[1]
      , last = uri.length - 1
    ;
    if (
         uri[0] === '"' && uri[last] === '"'
      || uri[0] === "'" && uri[last] === "'"
    ) {
      uri = uri.slice(1, -1);
    }
    return uri;
  }
}

// export function toggleCSSOpacity(target) {

//   var el = document.querySelector(target);

//   if(el.style.opacity == '1') {
//     el.style.opacity = '0';
//     setTimeout( function(){ el.style.display = 'none' }, 100); 
//   } else {
//     el.style.display = 'block';
//     // Delay setting opacity, or opacity transition will not fire, due to https://bugs.chromium.org/p/chromium/issues/detail?id=121340
//     setTimeout( function(){ el.style.opacity = 1 }, 100); 
//   }
// }
