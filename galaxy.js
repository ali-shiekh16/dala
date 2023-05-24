import { Float32BufferAttribute } from 'three';
import MeshObject from './object';
import scene from './scene';

export default class Galaxy extends MeshObject {
  async _setGeometry(meshPath) {
    const galaxy = await super._setGeometry(meshPath);

    this.geometry = galaxy.geometry;

    const scale = 5;
    this.geometry.scale(scale, scale, scale);
    // this.geometry.rotateY(Math.PI * 0.5);
  }

  _setNormal() {
    this.normal = new Float32BufferAttribute([], 3);
  }
}
