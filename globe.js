import MeshObject from './object';

export default class Globe extends MeshObject {
  async _setGeometry(meshPath) {
    const { geometry } = await super._setGeometry(meshPath);

    const scale = 150;
    geometry.scale(scale, scale, scale);

    geometry.translate(0, 0, 10);

    this.geometry = geometry;
  }
}
