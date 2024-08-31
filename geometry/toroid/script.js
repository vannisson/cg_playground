// Initialize the scene, camera, and renderer
const container = document.getElementById("toroidCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  container.clientWidth / container.clientHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
const renderer = new THREE.WebGLRenderer({ canvas: container });
renderer.setSize(container.clientWidth - 16, container.clientHeight - 16); // Set the size of the renderer to fill the canvas

// Add orbit controls to allow user interaction with the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Variable to hold the toroid mesh
let toroid = null;

/**
 * Creates a toroid geometry based on the provided parameters,
 * and adds it to the scene. If a toroid already exists, it is removed first.
 *
 * @param {number} majorRadius - The major radius of the toroid.
 * @param {number} minorRadius - The minor radius of the toroid.
 * @param {number} majorSegments - The number of major segments.
 * @param {number} minorSegments - The number of minor segments.
 * @param {boolean} wireframe - Defines if the object will display the wireframe.
 */
function createToroid(
  majorRadius,
  minorRadius,
  majorSegments,
  minorSegments,
  wireframe = true
) {
  // Remove and dispose of the existing toroid if it exists
  if (toroid) {
    scene.remove(toroid);
    toroid.geometry.dispose();
    toroid.material.dispose();
    toroid = null;
  }

  const vertices = [];
  const indices = [];

  // Generate the vertices of the toroid
  for (let j = 0; j <= majorSegments; j++) {
    for (let i = 0; i <= minorSegments; i++) {
      const u = (i / minorSegments) * 2 * Math.PI; // Calculate the angle around the minor radius
      const v = (j / majorSegments) * 2 * Math.PI; // Calculate the angle around the major radius

      // Calculate the x, y, and z coordinates of the vertex
      const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
      const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
      const z = minorRadius * Math.sin(v);

      // Add the vertex to the vertices array
      vertices.push(x, y, z);
    }
  }

  // Generate the indices of the toroid
  for (let j = 1; j <= majorSegments; j++) {
    for (let i = 1; i <= minorSegments; i++) {
      const a = (minorSegments + 1) * j + i - 1;
      const b = (minorSegments + 1) * (j - 1) + i - 1;
      const c = (minorSegments + 1) * (j - 1) + i;
      const d = (minorSegments + 1) * j + i;

      // Add the first triangle of the quad
      indices.push(a, b, d);

      // Add the second triangle of the quad
      indices.push(b, c, d);
    }
  }

  // Create the geometry and set its vertices and indices
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // Create the material
  const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff, // Set the color of the toroid
    wireframe: wireframe, // Set whether the material should display as wireframe
  });

  // Create the toroid mesh
  toroid = new THREE.Mesh(geometry, material);

  // Add the toroid to the scene
  scene.add(toroid);
}

// Function to update the toroid geometry based on user input
function updateToroid() {
  const majorRadius = parseFloat(
    document.getElementById("major-radius-input").value
  );
  const minorRadius = parseFloat(
    document.getElementById("minor-radius-input").value
  );
  const majorSegments = parseInt(
    document.getElementById("major-segments-input").value
  );
  const minorSegments = parseInt(
    document.getElementById("minor-segments-input").value
  );
  const wireframe = document.getElementById(
    "toroid-wireframe-checkbox"
  ).checked;

  createToroid(
    majorRadius,
    minorRadius,
    majorSegments,
    minorSegments,
    wireframe
  );
}

// Add event listeners to update the toroid when input values change
document
  .getElementById("major-radius-input")
  .addEventListener("input", updateToroid);
document
  .getElementById("minor-radius-input")
  .addEventListener("input", updateToroid);
document
  .getElementById("major-segments-input")
  .addEventListener("input", updateToroid);
document
  .getElementById("minor-segments-input")
  .addEventListener("input", updateToroid);
document
  .getElementById("toroid-wireframe-checkbox")
  .addEventListener("input", updateToroid);

// Set the initial camera position
camera.position.set(0, 5, 10);
controls.update();

// Create the initial toroid
updateToroid();

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Adjust canvas size when the window is resized
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight; // Update the camera's aspect ratio
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth - 16, container.clientHeight - 16); // Update the renderer size
});
