import './style.css';
import * as THREE from 'three';
import camera, { updateCamera } from './camera';
import configs from './configuration';
import renderer, { handleFullScreen, updateRenderer } from './renderer';
import scene from './scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import frag from './shaders/frag.glsl';
import vert from './shaders/vert.glsl';

import dat from 'dat.gui';

const { sizes } = configs;

const particlesCount = 2500;

renderObjects();

async function getGlobeGeometry() {
  // land shell
  const earth = await loadObject('/map.glb');
  const earthGeometry = earth.geometry;

  const scale = 1700;
  earthGeometry.scale(scale, scale, scale);

  earthGeometry.translate(0, 0, 350);
  // scene.add(earth);

  // sphere
  // const sphereGeometry = new THREE.SphereGeometry(185, 35, 35);

  // const combined = [
  //   ...earthGeometry.attributes.position.array,
  //   ...sphereGeometry.attributes.position.array,
  // ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(earthGeometry.attributes.position.array, 3)
  );

  return geometry;
}

async function getBrainGeometry() {
  const group = await loadObject('brain/Brain1.gltf');

  const brain = group.children[1];
  brain.geometry.scale(30, 30, 30);

  return brain.geometry;
}

async function renderObjects() {
  const globeGeometry = await getGlobeGeometry();

  const brainGeometry = await getBrainGeometry();

  globeGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(globeGeometry.attributes.position.array, 3)
  );
  globeGeometry.setAttribute(
    'secondaryPosition',
    new THREE.BufferAttribute(brainGeometry.attributes.position.array, 3)
  );

  const material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives: enable',
    },
    depthWrite: false,
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uSize: { value: 10 },
      uTexture: { value: new THREE.TextureLoader().load('/1.png') },
      uColor: { value: new THREE.Vector3(1, 0, 0) },
      uTransformationFactor: { value: 0 },
      // uDestruction: { value: 0 },
    },
    depthTest: false,
    transparent: true,
  });

  const points = new THREE.Points(globeGeometry, material);

  scene.add(points);

  // const pointsMaterial = new THREE.PointsMaterial({
  //   size: 2,
  //   color: 0xff00ff,
  // });

  const gui = new dat.GUI();
  gui
    .add(material.uniforms.uTransformationFactor, 'value')
    .max(1)
    .min(0)
    .step(0.01)
    .name('Morph');
  // .onChange(value => {
  //   // brain.material.opacity = (1 - value) * 0.05;
  //   // earth.material.opacity = value * 0.05;
  // });

  // const gui = new dat.GUI();
  // gui
  //   .add(cloud.material.uniforms.uTransformationFactor, 'value')
  //   .max(1)
  //   .min(0)
  //   .step(0.01)
  //   .name('Morph')
  //   .onChange(value => {
  //     // brain.material.opacity = (1 - value) * 0.05;
  //     // earth.material.opacity = value * 0.05;
  //   });
  // gui
  //   .add(cloud.material.uniforms.uDestruction, 'value')
  //   .max(400)
  //   .min(0)
  //   .step(0.01)
  //   .name('Destruction')
  //   .onChange(value => {
  //     const opacity = cloud.material.uniforms.uTransformationFactor.value;
  //     if (value <= 20) {
  //       brain.material.opacity = (1 - opacity) * 0.05;
  //       earth.material.opacity = opacity * 0.05;
  //     } else brain.material.opacity = earth.material.opacity;
  //   });
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

window.addEventListener('dblclick', handleFullScreen);

function populateVertices(
  mesh,
  count,
  scale = 1,
  xOffset = 0,
  yOffset = 0,
  zOffset = 0
) {
  const vertices = [];

  const sampler = new MeshSurfaceSampler(mesh).build();
  const tempPosition = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(tempPosition);
    vertices.push(
      (tempPosition.x + xOffset) * scale,
      (tempPosition.y + yOffset) * scale,
      (tempPosition.z + zOffset) * scale
    );
  }

  return vertices;
}

function generateColors() {
  const colors = [];
  for (let i = 0; i < particlesCount; i++) colors.push(1, 0, 1);

  return colors;
}

async function loadObject(url) {
  let model = null;
  try {
    const loader = new GLTFLoader();
    model = await loader.loadAsync(url);
  } catch (ex) {
    console.log(ex.message);
  }

  return model.scene.children[0];
}

function generateRandomArr(length) {
  const arr = [];
  for (let i = 0; i < length; i++)
    arr.push(Math.random(), Math.random(), Math.random());

  return arr;
}

function renderPointsCloud(vertices, secondaryVertices) {
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  geometry.setAttribute(
    'secondaryPosition',
    new THREE.Float32BufferAttribute(secondaryVertices, 3)
  );

  geometry.setAttribute(
    'aColor',
    new THREE.Float32BufferAttribute(generateColors(), 3)
  );

  geometry.setAttribute(
    'aRandom',
    new THREE.Float32BufferAttribute(generateRandomArr(particlesCount), 3)
  );

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/1.png');

  const material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives: enable',
    },
    depthWrite: false,
    color: 0xff0000,
    vertexShader,
    fragmentShader,
    uniforms: {
      uSize: { value: 15 },
      uTexture: { value: texture },
      uColor: { value: new THREE.Vector3(0) },
      uTransformationFactor: { value: 0 },
      uDestruction: { value: 0 },
    },

    depthTest: false,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);

  scene.add(points);

  return points;
}
