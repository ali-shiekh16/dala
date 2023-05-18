import './style.scss';
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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/src/ScrollTrigger';

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

async function getBrainGeometry() {
  const group = await loadObject('brain.glb');

  const brain = group.children[0];

  // console.log(brain);

  const scale = 2000;
  brain.geometry.scale(scale, scale, scale);

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      brain.geometry.attributes.position.array,
      3
    )
  );

  geometry.setAttribute(
    'normal',
    new THREE.Float32BufferAttribute(brain.geometry.attributes.normal.array, 3)
  );

  const random = [];
  const colors = [];

  const q = ['pink', 'red', 'red', 'red', 'maroon', 'maroon', 'maroon'];

  const color = new THREE.Color();
  for (
    let i = 0;
    i < brain.geometry.attributes.position.array.length / 3;
    i++
  ) {
    random.push(Math.random(), Math.random(), Math.random());

    color.set(q[THREE.MathUtils.randInt(0, q.length - 1)]);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute(
    'aRand',
    new THREE.Float32BufferAttribute(new Float32Array(random), 3)
  );

  geometry.setAttribute(
    'aColor',
    new THREE.Float32BufferAttribute(new Float32Array(colors), 3)
  );

  return geometry;
}

async function renderObjects() {
  const globeGeometry = await getGlobeGeometry();

  const brainGeometry = await getBrainGeometry();

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(brainGeometry.attributes.position.array, 3)
  );

  geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(brainGeometry.attributes.normal.array, 3)
  );

  geometry.setAttribute(
    'secondaryPosition',
    new THREE.BufferAttribute(globeGeometry.attributes.position.array, 3)
  );

  geometry.setAttribute(
    'secondaryNormal',
    new THREE.BufferAttribute(globeGeometry.attributes.normal.array, 3)
  );

  geometry.setAttribute(
    'aRand',
    new THREE.BufferAttribute(brainGeometry.attributes.aRand.array, 3)
  );

  geometry.setAttribute(
    'aColor',
    new THREE.BufferAttribute(brainGeometry.attributes.aColor.array, 3)
  );

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

  let section = 0;
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
  // .to(points.position, {
  //   x: 0,
  // });
  // .to(points.position, {
  //   x: 0,
  //   y: 0,
  // });

  // .to(points.position, {
  //   x: 0,
  //   scrollTrigger: {
  //     trigger: '#section-2',
  //     start: 'top top',
  //     scrub: 4,
  //     markers: true,
  //   },
  // });

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

window.addEventListener('dblclick', handleFullScreen);

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
