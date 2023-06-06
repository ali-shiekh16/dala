import {
  BufferGeometry,
  Points,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from 'three';
import frag from './shaders/frag.glsl';
import vert from './shaders/vert.glsl';

import dat from 'dat.gui';
import TouchTexture from './touchTextures';

export default class ParticleCloud {
  objects = [];
  material = null;
  geometry = null;
  cloud = null;
  debugger = null;

  constructor(objects) {
    this.objects = objects;

    this.geometry = new BufferGeometry();

    this.material = this.#createMaterial();

    this.#setGeometry();

    this.#initTouch();

    this.cloud = new Points(this.geometry, this.material);

    this.#createDebugger();
  }

  #setGeometry() {
    this.objects.forEach((object, index) => {
      if (!index) {
        this.geometry.setAttribute('position', object.position);
        this.geometry.setAttribute('normal', object.normal);
        this.geometry.setAttribute('aRand', object.randomPosition);
        this.geometry.setAttribute('aColor', object.color);
        this.geometry.setAttribute('uv', object.uv);

        return;
      }

      this.geometry.setAttribute(`normal${index + 1}`, object.normal);

      this.geometry.setAttribute(`position${index + 1}`, object.position);

      this.material.uniforms[`uMorph${index + 1}`] = { value: 0 };
    });
  }

  #createMaterial() {
    return new ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives: enable',
      },
      depthWrite: false,
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uSize: { value: 45 },
        uTexture: { value: new TextureLoader().load('/triangle.png') },
        uColor: { value: new Vector3(1, 0, 0) },
        uDestruction: { value: 0 },
        uPoint: { value: { x: 0, y: 0, z: 0 } },
        uTouch: { value: null },
        uTime: { value: 0 },
      },
      depthTest: false,
      transparent: true,
    });
  }

  #initTouch() {
    // create only once
    if (!this.touch) this.touch = new TouchTexture(this);
    this.material.uniforms.uTouch.value = this.touch.texture;
  }

  update(delta) {
    if (!this.cloud) return;
    if (this.touch) this.touch.update();

    this.material.uniforms.uTime.value += delta;
  }

  onInteractiveMove(e) {
    const uv = e.intersectionData.uv;
    if (this.touch) this.touch.addTouch(uv);
  }

  #createDebugger() {
    this.debugger = new dat.GUI();

    for (let i = 2; i <= this.objects.length; i++) {
      this.debugger
        .add(this.material.uniforms[`uMorph${i}`], 'value')
        .max(1)
        .min(0)
        .step(0.01)
        .name(`Morph${i}`);
    }

    this.debugger
      .add(this.material.uniforms.uDestruction, 'value')
      .max(1)
      .min(0)
      .step(0.01)
      .name('Destruction');

    this.debugger.hide();
  }

  showDebugger() {
    this.debugger.show();
  }

  hideDebugger() {
    this.debugger.hide();
  }
}
