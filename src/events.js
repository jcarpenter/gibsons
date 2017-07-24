export default class Events {
  constructor(camera, state) {

    window.addEventListener('keydown', function(e){

      var handled = false;

      // check if meta or ctrl keys are pressed. If not, proceed. Ensures keyboard shortcuts work properly on Mac & Windows.
      if ((!e.metaKey) || (!e.metaKey)) {

        switch (e.keyCode) {
          case 49: { // 1
            state.setDisplayMode('mobile');
            handled = true;
            break;
          }
          case 50: { // 2
            state.setDisplayMode('vr-fullscreen');
            handled = true;
            break;
          }
          case 51: { // 3
            state.setDisplayMode('vr-windowed');
            handled = true;
            break;
          }
          case 52: { // 4
            camera.lookAroundEdgesOfWebview();
            handled = true;
            break;

          }
          case 53: { // 5
            camera.lookSideToSide();
            handled = true;
            break;
          }
          case 54: { // 6
            camera.panSideToSide();
            handled = true;
            break;
          }

          case 32: { // space
            handled = true;
            break;
          }
        }

        if (handled) e.preventDefault();
      }
    });
  }
}