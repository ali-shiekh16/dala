import MeshObject from './object';

export default class Robot extends MeshObject {
  async _setGeometry(meshPath) {
    const mesh = await super._setGeometry(meshPath);

    // mesh.geometry.scale(scale, scale, scale);

    console.log(mesh.children);
    this.geometry = mesh.children[3].geometry;

    const scale = 500;
    this.geometry.scale(scale, scale, scale);
  }
}
