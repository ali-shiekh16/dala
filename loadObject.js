import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default async function loadObject(url) {
  let model = null;
  try {
    const loader = new GLTFLoader();
    model = await loader.loadAsync(url);
  } catch (ex) {
    console.log(ex.message);
  }

  return model.scene.children[0];
}
