import Config from './config'

export default class RendererGL {
  constructor(scene, container) {
    this.scene = scene;
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    container.appendChild(this.renderer.domElement);
    
    this.updateSize();
    document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
    window.addEventListener('resize', () => this.updateSize(), false);
  }

  updateSize() {
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera)
  }
}