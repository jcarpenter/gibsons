export default class Container {
  constructor() {

    // the container element will contain our Three.js renderers
    this.container = document.createElement('div');
    this.container.id = 'container';
    this.container.style.position = 'absolute';
    this.container.style.width = '100%';
    this.container.style.height = '100vh';
    this.container.style.top = this.container.style.left = 0;
    document.body.appendChild(this.container);
  }
}