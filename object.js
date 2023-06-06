import loadObject from './loadObject';
import { MathUtils, Float32BufferAttribute, Color } from 'three';

export default class MeshObject {
  geometry = null;

  normal = null;
  position = null;

  color = null;
  randomPosition = null;

  uv = null;

  constructor(meshPath) {
    this.meshPath = meshPath;
  }

  async init() {
    await this._setGeometry(this.meshPath);
    this._setNormal();

    this.#setPosition();
    this.#setColorsAndRandPosition();
    this.#setUV();
  }

  async _setGeometry(meshPath) {
    const mesh = await loadObject(meshPath);
    this.geometry = mesh.geometry;

    return mesh;
  }

  _setNormal() {
    if (!this.geometry.attributes?.normal?.array?.length)
      throw new Error('Normals undefined');

    this.normal = new Float32BufferAttribute(
      this.geometry.attributes.normal.array,
      3
    );
  }

  #setPosition() {
    this.position = new Float32BufferAttribute(
      this.geometry.attributes.position.array,
      3
    );
  }

  #setUV() {
    if (this.geometry.attributes.uv)
      this.uv = new Float32BufferAttribute(
        this.geometry.attributes.uv.array,
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
