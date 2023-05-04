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
const particlesCount = 2500;

const objectMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xffffff,
  transparent: true,
  opacity: 0.05,
});

async function renderObjects() {
  // temp code
  const earthScale = 600;
  const earth = await loadObject('/Earth_Geo.gltf');
  earth.material = objectMaterial.clone();
  earth.scale.set(earthScale, earthScale, earthScale);
  earth.material.opacity = 0;
  scene.add(earth);

  vertices.earth = populateVertices(earth, particlesCount, earthScale);

  const geometry = earth.geometry;
  const material = new THREE.PointsMaterial({
    color: 'red',
    size: 6,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.scale.set(700, 700, 700);
  points.position.setZ(200);
  scene.add(points);

  const sphere = new THREE.Points(
    new THREE.SphereGeometry(180, 35, 35),
    new THREE.PointsMaterial({
      color: 'red',
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
    })
  );

  scene.add(sphere);

  // cloud = renderPointsCloud(vertices.earth, vertices.earth);
  // temp end

  // const earthScale = 600;
  // const earth = await loadObject('/Earth_Geo.gltf');
  // earth.material = objectMaterial.clone();
  // earth.scale.set(earthScale, earthScale, earthScale);
  // earth.material.opacity = 0;
  // scene.add(earth);

  // vertices.earth = populateVertices(earth, particlesCount, earthScale);
  // cloud = renderPointsCloud(vertices.earth, vertices.earth);

  // const brain = await loadObject('/brain.glb');
  // const scale = 1.5;
  // brain.material = objectMaterial.clone();
  // brain.scale.set(scale, scale, scale);
  // scene.add(brain);

  // vertices.brain = populateVertices(brain, particlesCount, scale);
  // vertices.main = vertices.brain;

  // cloud = renderPointsCloud(vertices.main, vertices.earth);

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

  console.log(model.scene);

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
      uSize: { value: 12 },
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
