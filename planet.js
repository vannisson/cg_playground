import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Initialize scene, camera, and renderer
const container = document.getElementById("canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
// Invert the camera position to the opposite side
camera.position.set(-2, -6, -10);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movements

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft ambient light
scene.add(ambientLight);

// Move the directional light to the opposite side
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, 10, -7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Create the main planet
const planetGeometry = new THREE.IcosahedronGeometry(3, 0);
const planetMaterial = new THREE.MeshStandardMaterial({
  color: 0xff2200,
  flatShading: true,
});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.castShadow = true;
planet.receiveShadow = true;
scene.add(planet);

// Create the orbiting object (smaller planet)
const orbitingObjectGeometry = new THREE.IcosahedronGeometry(0.3, 0);
const orbitingObjectMaterial = new THREE.MeshStandardMaterial({
  color: 0x0055ff,
  flatShading: true,
});
const orbitingObject = new THREE.Mesh(
  orbitingObjectGeometry,
  orbitingObjectMaterial
);
orbitingObject.castShadow = true;
orbitingObject.receiveShadow = true;
scene.add(orbitingObject);

// Define orbit variables
let angle = 0; // Initial angle
const orbitRadius = 5; // Distance from the main planet to the orbiting object
const orbitTilt = Math.PI / 4; // Orbit inclination (45 degrees)

// Create a ring to visualize the orbit
const ringGeometry = new THREE.RingGeometry(
  orbitRadius - 0.05,
  orbitRadius + 0.05,
  18
);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
ring.rotation.x = orbitTilt; // Rotate the ring to lay flat horizontally
scene.add(ring);

function animate() {
  // Update the angle for the orbiting object
  angle += 0.01;

  // Update orbiting object's position using polar coordinates and applying orbit tilt
  orbitingObject.position.x = planet.position.x + orbitRadius * Math.cos(angle);
  orbitingObject.position.z =
    planet.position.z + orbitRadius * Math.sin(angle) * Math.cos(orbitTilt);
  orbitingObject.position.y =
    orbitRadius * Math.sin(orbitTilt) * Math.sin(angle);

  // Rotate the main planet
  planet.rotation.y += 0.005;

  // Update the controls for smooth camera movement
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Request the next frame to keep the animation loop running
  requestAnimationFrame(animate);
}

// Start the animation loop
animate();

// Adjust scene on window resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
