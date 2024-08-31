// Get the canvas element from the DOM
const container = document.getElementById("sphereCanvas");

// Create a new Three.js scene
const scene = new THREE.Scene();

// Set up a perspective camera
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

// Create a WebGL renderer and attach it to the canvas
const renderer = new THREE.WebGLRenderer({ canvas: container });
renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);

// Add OrbitControls to allow interactive rotation and zoom
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Get the checkbox element from the DOM
const wireframeCheckbox = document.getElementById("checked-checkbox");

// Variable to hold the sphere mesh
let sphere = null;

/**
 * Creates a sphere geometry based on the provided parameters,
 * and adds it to the scene. If a sphere already exists, it is removed first.
 *
 * @param {number} radius - The radius of the sphere.
 * @param {number} widthSegments - The number of horizontal segments.
 * @param {number} heightSegments - The number of vertical segments.
 * @param {boolean} wireframe - Defines if the object will display the wireframe.
 */
function createSphere(radius, widthSegments, heightSegments, wireframe = true) {
  // Remove and dispose of the existing sphere if it exists
  if (sphere) {
    scene.remove(sphere);
    sphere.geometry.dispose();
    sphere.material.dispose();
    sphere = null;
  }

  // Create sphere geometry
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  // Create a mesh with the geometry and a basic material
  const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: wireframe,
  });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}

// Initialize the sphere with default parameters
createSphere(5, 20, 20);

// Set the initial camera position
camera.position.set(0, 5, 20);

/**
 * Animation loop to render the scene and update controls.
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

/**
 * Event listener to handle window resizing. Adjusts the camera's aspect ratio
 * and updates the renderer's size to match the new dimensions of the container.
 */
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Update the camera's aspect ratio and projection matrix
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Resize the renderer to match the container size
  renderer.setSize(width - 16, height - 16);
});

// Get radius, width segments, and height segments input elements from the DOM
const radiusInput = document.getElementById("radius-input");
const widthSegmentsInput = document.getElementById("width-segments-input");
const heightSegmentsInput = document.getElementById("height-segments-input");

/**
 * Updates the sphere based on the current values of the input elements and the wireframe checkbox.
 */
function updateSphere() {
  const radius = parseFloat(radiusInput.value);
  const widthSegments = parseInt(widthSegmentsInput.value);
  const heightSegments = parseInt(heightSegmentsInput.value);
  const wireframe = wireframeCheckbox.checked;

  createSphere(radius, widthSegments, heightSegments, wireframe);
}

// Add event listeners to update the sphere when the inputs change
radiusInput.addEventListener("input", updateSphere);
widthSegmentsInput.addEventListener("input", updateSphere);
heightSegmentsInput.addEventListener("input", updateSphere);
wireframeCheckbox.addEventListener("change", updateSphere);
