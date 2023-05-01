import './style.css';
import * as THREE from 'three';
import camera, { updateCamera } from './camera';
import configs from './configuration';
import renderer, { handleFullScreen, updateRenderer } from './renderer';
import scene from './scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import dat from 'dat.gui';

const { sizes } = configs;

const vertices = {
  main: [],
  brain: [],
  earth: [],
};

let cloud = null;
const particlesCount = 1500;

const objectMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xffffff,
  transparent: true,
  opacity: 0.05,
});

async function renderObjects() {
  const earth = await loadObject('/Earth.glb');
  earth.material = objectMaterial.clone();
  earth.scale.set(20, 20, 20);
  earth.material.opacity = 0;
  scene.add(earth);

  vertices.earth = populateVertices(earth, particlesCount);

  const brain = await loadObject('/brain.glb');
  const scale = 1.5;
  brain.material = objectMaterial.clone();
  brain.scale.set(scale, scale, scale);
  brain.position.y -= 90;
  scene.add(brain);

  vertices.brain = populateVertices(brain, particlesCount, scale, 0, -60, 0);
  vertices.main = vertices.brain;

  cloud = renderPointsCloud(vertices.main, vertices.earth);

  const gui = new dat.GUI();
  gui
    .add(cloud.material.uniforms.uTransformationFactor, 'value')
    .max(1)
    .min(0)
    .step(0.01)
    .onChange(value => {
      brain.material.opacity = (1 - value) * 0.05;
      earth.material.opacity = value * 0.05;
    });
}

renderObjects();

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

  const factor = Math.floor(particlesCount / 4);

  for (let i = 0; i < particlesCount; i++) {
    if (i <= factor) colors.push(1, 0, 0);
    else if (i <= factor * 2) colors.push(0, 1, 0);
    else if (i <= factor * 3) colors.push(0, 0, 1);
    else colors.push(1, 0, 1);
  }

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

  const colors = generateColors();

  geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3));

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
      uSize: { value: 12 },
      uTexture: { value: texture },
      uColor: { value: new THREE.Vector3(0) },
      uTransformationFactor: { value: 0 },
    },

    depthTest: false,
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);

  scene.add(points);

  return points;
}
