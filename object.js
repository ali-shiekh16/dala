import loadObject from './loadObject';
import { MathUtils, Float32BufferAttribute, Color } from 'three';

export default class MeshObject {
  geometry = 'programming is frustating';

  normal = null;
  position = null;

  color = null;
  randomPosition = null;

  #meshPath = null;

  constructor(meshPath) {
    this.meshPath = meshPath;
  }

  async init() {
    await this._setGeometry(this.meshPath);
    this.#setPosition();
    this.#setNormal();
    this.#setColorsAndRandPosition();
  }

  async _setGeometry(meshPath) {
    const geometry = await loadObject(meshPath);
    this.geometry = geometry;

    return this.geometry;
  }

  #setPosition() {
    this.position = new Float32BufferAttribute(
      this.geometry.attributes.position.array,
      3
    );
  }

  #setNormal() {
    this.normal = new Float32BufferAttribute(
      this.geometry.attributes.normal.array,
      3
    );
  }

  #setColorsAndRandPosition() {
    const randVertices = [];
    const colors = [];

    const pallete = ['pink', 'red', 'red', 'red', 'maroon', 'maroon', 'maroon'];

    const color = new Color();
    for (
      let i = 0;
      i < this.geometry.attributes.position.array.length / 3;
      i++
    ) {
      randVertices.push(Math.random(), Math.random(), Math.random());

      color.set(pallete[MathUtils.randInt(0, pallete.length - 1)]);
      colors.push(color.r, color.g, color.b);
    }

    this.color = new Float32BufferAttribute(colors, 3);
    this.randomPosition = new Float32BufferAttribute(randVertices, 3);
  }
}
