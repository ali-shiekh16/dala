import { Float32BufferAttribute } from 'three';
import MeshObject from './object';

export default class Galaxy extends MeshObject {
  async _setGeometry(meshPath) {
    const galaxy = await super._setGeometry(meshPath);

    this.geometry = galaxy.geometry;

    const scale = 0.2;
    this.geometry.scale(scale, scale, scale);
  }

  _setNormal() {
    this.normal = new Float32BufferAttribute(new Array(21520 * 3).fill(0), 3);
  }
}
