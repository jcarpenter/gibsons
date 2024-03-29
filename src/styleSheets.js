export default class StyleSheets {
  constructor() {
  
    // get document stylesheets    
    this.sheets = document.styleSheets;

    // create a variable for the stylesheet with 'vr' title
    for (var i = 0; i < this.sheets.length; i++) {
      if (this.sheets[i].title === 'vr') {
        this.vr = this.sheets[i];
      }
    }

  }

  setVRSheet(mode) {
    if (mode == 'disable') {
      this.vr.disabled = true;
    } else if (mode == 'enable') {
      this.vr.disabled = false;
    }
  }
}