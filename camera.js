import { PerspectiveCamera, Vector3 } from 'three';
import configs from './configuration';

const { width, height } = configs.sizes;

const camera = new PerspectiveCamera(50, width / height, 0.0001, 5000);
camera.position.setZ(700);
// camera.position.setY(500);

function updateCamera(width, height) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

export default camera;
export { updateCamera };
