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
import Brain from './brain';
import Globe from './globe';
import Robot from './robot';
import Galaxy from './galaxy';

import dat from 'dat.gui';

const { sizes } = configs;

renderObjects();

async function renderObjects() {
  const globe = new Globe('./globe.glb');
  await globe.init();

  const brain = new Brain('./brain.glb');
  await brain.init();

  const robot = new Robot('./Robot.glb');
  await robot.init();

  const galaxy = new Galaxy('./Galaxy.glb');
  await galaxy.init();
  console.log(galaxy);

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', galaxy.position);
  geometry.setAttribute('normal', galaxy.normal);
  geometry.setAttribute('aRand', galaxy.randomPosition);
  geometry.setAttribute('aColor', galaxy.color);

  geometry.setAttribute('secondaryPosition', globe.position);
  geometry.setAttribute('secondaryNormal', globe.normal);

  const material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives: enable',
    },
    depthWrite: false,
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uSize: { value: 25 },
      uTexture: { value: new THREE.TextureLoader().load('/triangle.png') },
      uColor: { value: new THREE.Vector3(1, 0, 0) },
      uTransformationFactor: { value: 0 },
      uDestruction: { value: 0 },
    },
    depthTest: false,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);
  // points.rotateY(-Math.PI / 2);
  // points.position.setX(150);
  // points.rotateY(Math.PI / 4);

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
