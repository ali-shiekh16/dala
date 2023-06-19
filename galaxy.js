import { Float32BufferAttribute } from 'three';
import MeshObject from './object';

export default class Galaxy extends MeshObject {
  async _setGeometry(meshPath) {
    const galaxy = await super._setGeometry(meshPath);

    this.geometry = galaxy.geometry;

    const scale = 0.2;
    this.geometry.scale(scale, scale, scale);
  }

  setPosition() {
    let newPosition = [];
    if (this.geometry.attributes.position.array.length < this.maxVertices * 3) {
      newPosition = [
        ...this.geometry.attributes.position.array,
        ...new Array(
          this.maxVertices * 3 - this.geometry.attributes.position.array.length
        ).fill(0),
      ];

      this.position = new Float32BufferAttribute(newPosition, 3);
    }
  }

  _setNormal() {
    this.normal = new Float32BufferAttribute(
      new Array(this.maxVertices * 3).fill(0),
      3
    );
  }
}
