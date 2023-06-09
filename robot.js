import MeshObject from './object';

export default class Robot extends MeshObject {
  async _setGeometry(meshPath) {
    const group = await super._setGeometry(meshPath);

    this.geometry = group.geometry;

    const scale = 100;
    this.geometry.scale(scale, scale, scale);
    this.geometry.rotateZ(-Math.PI / 2);
    this.geometry.rotateX(-Math.PI / 2);

    
  }
}
