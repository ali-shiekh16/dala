import './style.scss';
import * as THREE from 'three';
import camera, { updateCamera } from './camera';
import configs from './configuration';
import renderer, { updateRenderer } from './renderer';
import scene from './scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import frag from './shaders/frag.glsl';
import vert from './shaders/vert.glsl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/src/ScrollTrigger';
import loadObject from './loadObject';
import Brain from './brain';

import dat from 'dat.gui';

const { sizes } = configs;

renderObjects();

async function getGlobeGeometry() {
  // land shell
  const earth = await loadObject('/map1.glb');

  const earthGeometry = earth.geometry;

  const scale = 150;
  earthGeometry.scale(scale, scale, scale);

  earthGeometry.translate(0, 0, 10);

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(earthGeometry.attributes.position.array, 3)
  );

  geometry.setAttribute(
    'normal',
    new THREE.Float32BufferAttribute(earthGeometry.attributes.normal.array, 3)
  );

  const random = [];
  for (
    let i = 0;
    i < earthGeometry.attributes.position.array.length / 3;
    i += 3
  )
    random.push(Math.random(), Math.random(), Math.random());

  geometry.setAttribute(
    'aRand',
    new THREE.Float32BufferAttribute(new Float32Array(random), 3)
  );

  return geometry;
}

async function renderObjects() {
  const globeGeometry = await getGlobeGeometry();

  const brain = new Brain('./brain.glb');
  await brain.init();

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', brain.position);

  geometry.setAttribute('normal', brain.normal);

  geometry.setAttribute(
    'secondaryPosition',
    new THREE.BufferAttribute(globeGeometry.attributes.position.array, 3)
  );

  geometry.setAttribute(
    'secondaryNormal',
    new THREE.BufferAttribute(globeGeometry.attributes.normal.array, 3)
  );

  geometry.setAttribute('aRand', brain.randomPosition);

  geometry.setAttribute('aColor', brain.color);

  const material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives: enable',
    },
    depthWrite: false,
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uSize: { value: 50 },
      uTexture: { value: new THREE.TextureLoader().load('/triangle.png') },
      uColor: { value: new THREE.Vector3(1, 0, 0) },
      uTransformationFactor: { value: 0 },
      uDestruction: { value: 0 },
    },
    depthTest: false,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);
  points.rotateY(-Math.PI / 2);
  points.position.setX(150);

  scene.add(points);

  gsap.registerPlugin(ScrollTrigger);

  gsap
    .timeline({
      ease: 'slow',
      scrollTrigger: {
        trigger: '.wrapper',
        start: 'top top',
        end: '100% top',
        scrub: 4,
      },
    })
    .to(points.position, {
      x: -150,
    })
    .to(
      points.rotation,
      {
        y: Math.PI / 2,
      },
      '<'
    )
    .to(points.position, {
      x: 0,
    })
    .to(
      points.rotation,
      {
        y: -Math.PI / 10,
      },
      '<'
    )
    .to(material.uniforms.uDestruction, {
      value: 1,
    })
    .to(
      points.position,
      {
        x: -150,
        y: -150,
      },
      '<'
    )
    .to(points.position, {
      x: 0,
      y: 0,
    })
    .to(
      material.uniforms.uDestruction,
      {
        value: 0,
      },
      '<'
    )
    .to(
      material.uniforms.uTransformationFactor,
      {
        value: 1,
      },
      '<'
    )
    .to(points.rotation, {
      y: -Math.PI / 3,
    })
    .to(
      points.position,
      {
        x: -150,
      },
      '<'
    )
    .to(points.position, {
      x: -150,
    })
    .to(points.position, {
      x: 0,
    });

  const gui = new dat.GUI();
  gui
    .add(material.uniforms.uTransformationFactor, 'value')
    .max(1)
    .min(0)
    .step(0.01)
    .name('Morph');

  gui
    .add(material.uniforms.uDestruction, 'value')
    .max(1)
    .min(0)
    .step(0.01)
    .name('Destruction');

  gui.hide();
}

const controls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  updateCamera(sizes.width, sizes.height);
  updateRenderer(sizes.width, sizes.height);
  renderer.render(scene, camera);
});
