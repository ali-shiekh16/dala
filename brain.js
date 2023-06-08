import MeshObject from './object';

export default class Brain extends MeshObject {
  async _setGeometry(meshPath) {
    const group = await super._setGeometry(meshPath);

    const brain = group.children[0];

    const scale = 2500;
    brain.geometry.scale(scale, scale, scale);
    this.geometry = brain.geometry;
  }
}
