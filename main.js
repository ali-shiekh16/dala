import './style.scss';
import camera, { updateCamera } from './camera';
import configs from './configuration';
import renderer, { updateRenderer } from './renderer';
import scene from './scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/src/ScrollTrigger';
import Brain from './brain';
import Globe from './globe';
import Robot from './robot';
import Galaxy from './galaxy';
import ParticleCloud from './particlesCloud';
import { MathUtils } from 'three';

const { sizes } = configs;
const mouse = { x: 0, y: 0 };
let cloud = null;

renderObjects().then(particles => {
  cloud = particles.cloud;
  animate(particles);
});

async function renderObjects() {
  const globe = new Globe('./globe.glb');
  await globe.init();

  const brain = new Brain('./brain.glb');
  await brain.init();

  const robot = new Robot('./Robot.glb');
  await robot.init();

  const galaxy = new Galaxy('./Galaxy.glb');
  await galaxy.init();

  const objects = [galaxy, globe, brain, robot];

  const particles = new ParticleCloud(objects);
  scene.add(particles.cloud);

  return particles;
}

function animate(particles) {
  gsap.registerPlugin(ScrollTrigger);
  const timeline = gsap.timeline({
    ease: 'slow',
    scrollTrigger: {
      trigger: '.wrapper',
      start: 'top top',
      end: '100% top',
      scrub: 4,
    },
  });

  timeline.to(particles.cloud.position, {
    x: -150,
  });

  timeline.to(
    particles.cloud.rotation,
    {
      x: -Math.PI / 10,
    },
    '<'
  );

  timeline.to(particles.cloud.position, {
    x: 0,
  });

  timeline.to(
    particles.cloud.rotation,
    {
      x: -Math.PI / 10,
    },
    '<'
  );

  timeline.to(particles.material.uniforms.uDestruction, {
    value: 1,
  });

  timeline.to(
    particles.cloud.position,
    {
      x: -150,
      y: -150,
    },
    '<'
  );

  timeline.to(particles.cloud.position, {
    x: 0,
    y: 0,
  });

  timeline.to(
    particles.material.uniforms.uDestruction,
    {
      value: 0,
    },
    '<'
  );

  timeline.to(
    particles.material.uniforms.uMorph2,
    {
      value: 1,
    },
    '<'
  );

  timeline.to(particles.cloud.rotation, {
    y: -Math.PI / 3,
  });

  timeline.to(
    particles.cloud.position,
    {
      x: -150,
    },
    '<'
  );

  timeline.to(particles.cloud.position, {
    x: -150,
  });

  timeline.to(particles.material.uniforms.uMorph3, {
    value: 1,
  });

  timeline.to(
    particles.cloud.position,
    {
      x: 150,
    },
    '<'
  );

  timeline.to(
    particles.cloud.rotation,
    {
      y: Math.PI / 2,
    },
    '<'
  );

  timeline.to(particles.cloud.position, {
    x: -200,
  });

  timeline.to(
    particles.cloud.rotation,
    {
      y: Math.PI / 2,
    },
    '<'
  );

  timeline.to(particles.material.uniforms.uDestruction, {
    value: 1,
  });

  timeline.to(particles.material.uniforms.uMorph4, {
    value: 1,
  });

  timeline.to(
    particles.material.uniforms.uDestruction,
    {
      value: 0,
    },
    '<'
  );

  timeline.to(particles.cloud.position, {
    x: 50,
  });

  timeline.to(particles.cloud.position, {
    x: -150,
  });
}

const controls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

function tick() {
  controls.update();

  if (cloud) {
    camera.rotation.y = MathUtils.lerp(
      camera.rotation.y,
      (mouse.x * Math.PI) / 20,
      0.1
    );
    camera.rotation.x = MathUtils.lerp(
      camera.rotation.x,
      (mouse.y * Math.PI) / 20,
      0.1
    );

    // camera.lookAt(cloud.position);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  updateCamera(sizes.width, sizes.height);
  updateRenderer(sizes.width, sizes.height);
  renderer.render(scene, camera);
});

window.addEventListener('mousemove', e => {
  mouse.x = 1 - 2 * (e.clientX / window.innerWidth);
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
});
