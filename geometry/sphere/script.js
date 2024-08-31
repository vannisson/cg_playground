// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('sphereCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight); // Set the renderer size to fill the window

// Add orbit controls to enable user interaction with the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Step 1: Define Sphere Parameters
const radius = 5; // Radius of the sphere
const widthSegments = 20; // Horizontal segments
const heightSegments = 20; // Vertical segments

const vertices = [];
const indices = [];

// Step 2: Calculate Vertices
for (let y = 0; y <= heightSegments; y++) {
    const phi = (y / heightSegments) * Math.PI; // Calculate vertical angle
    for (let x = 0; x <= widthSegments; x++) {
        const theta = (x / widthSegments) * 2 * Math.PI; // Calculate horizontal angle
        const vx = radius * Math.sin(phi) * Math.cos(theta); // X coordinate
        const vy = radius * Math.sin(phi) * Math.sin(theta); // Y coordinate
        const vz = radius * Math.cos(phi); // Z coordinate
        vertices.push(vx, vy, vz); // Add vertex to the list
    }
}

// Step 3: Create Faces
for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
        const base = y * (widthSegments + 1) + x;
        const a = base;
        const b = base + widthSegments + 1;
        const c = base + 1;
        const d = base + widthSegments + 2;

        // First Triangle
        indices.push(a, b, c);
        // Second Triangle
        indices.push(c, b, d);
    }
}

// Step 4: Create Geometry and Material
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); // Set vertices to geometry
geometry.setIndex(indices); // Set indices for the geometry

const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff, // Blue color
    wireframe: true // Display as a wireframe
});
const sphere = new THREE.Mesh(geometry, material);

// Add the Sphere to the Scene
scene.add(sphere);

// Set the initial position of the camera
camera.position.set(0, 5, 20);

// Animation function to be called on each frame
function animate() {
    requestAnimationFrame(animate); // Request the next frame

    controls.update(); // Update orbit controls
    renderer.render(scene, camera); // Render the scene from the camera's perspective
}

animate(); // Start the animation loop

// Handle window resize events for responsiveness
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect ratio
    camera.updateProjectionMatrix(); // Apply the aspect ratio changes
    renderer.setSize(window.innerWidth, window.innerHeight); // Resize the renderer
});
