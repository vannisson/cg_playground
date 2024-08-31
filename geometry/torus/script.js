// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('toroidCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the renderer to fill the window

// Add orbit controls to allow user interaction with the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Define the dimensions and segments of the toroid
const majorRadius = 3;
const minorRadius = 1;
const majorSegments = 16;
const minorSegments = 20;

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

    vertices.push(x, y, z); // Add the vertex to the list
  }
}

// Generate the indices for the triangles that make up the toroid
for (let j = 1; j <= majorSegments; j++) {
  for (let i = 1; i <= minorSegments; i++) {
    const a = (minorSegments + 1) * j + i - 1;
    const b = (minorSegments + 1) * (j - 1) + i - 1;
    const c = (minorSegments + 1) * (j - 1) + i;
    const d = (minorSegments + 1) * j + i;

    indices.push(a, b, d);
    indices.push(b, c, d);
  }
}

// Create the toroid geometry and material
const geometry = new THREE.BufferGeometry();
geometry.setIndex(indices); // Set the indices for the geometry
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3) // Assign the vertices to the geometry
);

const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff, // Blue color
  wireframe: true, // Display as a wireframe
});

// Create the mesh and add it to the scene
const toroid = new THREE.Mesh(geometry, material);
scene.add(toroid);

// Set the initial position of the camera
camera.position.set(0, 5, 20);

// Animation loop, called every frame
function animate() {
  requestAnimationFrame(animate); // Request the next frame

  controls.update(); // Update the orbit controls
  renderer.render(scene, camera); // Render the scene from the perspective of the camera
}

animate(); // Start the animation loop

// Handle window resize events to keep the scene responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight; // Update the camera aspect ratio
  camera.updateProjectionMatrix(); // Apply the aspect ratio changes
  renderer.setSize(window.innerWidth, window.innerHeight); // Resize the renderer
});
