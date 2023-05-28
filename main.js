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

const { sizes } = configs;

renderObjects().then(particles => {
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

  // const objects = [galaxy, globe, robot, brain];
  const objects = [galaxy, globe, brain, robot];

  const particles = new ParticleCloud(objects);
  scene.add(particles.cloud);

  console.log(particles.geometry.attributes);

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
      y: Math.PI / 2,
    },
    '<'
  );

  timeline.to(particles.cloud.position, {
    x: 0,
  });

  timeline.to(
    particles.cloud.rotation,
    {
      y: -Math.PI / 10,
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
      y: -Math.PI / 3,
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
