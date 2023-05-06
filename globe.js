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
