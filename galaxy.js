import { Float32BufferAttribute } from 'three';
import MeshObject from './object';
import scene from './scene';

export default class Galaxy extends MeshObject {
  async _setGeometry(meshPath) {
    const galaxy = await super._setGeometry(meshPath);

    this.geometry = galaxy.geometry;

    const scale = 3.0;
    this.geometry.scale(scale, scale, scale);
  }

  _setNormal() {
    this.normal = new Float32BufferAttribute(new Array(13180 * 3).fill(0), 3);
  }
}
