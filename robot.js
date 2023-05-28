import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
} from 'three';
import MeshObject from './object';
import scene from './scene';

export default class Robot extends MeshObject {
  async _setGeometry(meshPath) {
    const group = await super._setGeometry(meshPath);

    this.geometry = group.geometry;

    const scale = 80;
    this.geometry.scale(scale, scale, scale);
    this.geometry.rotateZ(-Math.PI / 2);
    this.geometry.rotateX(-Math.PI / 2);

    // let positions = [];
    // let normals = [];

    // this.geometry = group.children.forEach(child => {
    //   const { position, normal } = child.geometry.attributes;
    //   positions = [...positions, ...position.array];
    //   normals = [...normals, ...normal.array];
    //   console.log(child.children.length);
    // });

    // const geometry = new BufferGeometry();
    // geometry.setAttribute(
    //   'position',
    //   new Float32BufferAttribute(new Float32Array(positions), 3)
    // );
    // geometry.setAttribute(
    //   'normal',
    //   new Float32BufferAttribute(new Float32Array(normals), 3)
    // );

    // const scale = 180;
    // geometry.scale(scale, scale, scale);

    // this.geometry = geometry;
  }
}
