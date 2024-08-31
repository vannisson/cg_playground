// Get the canvas element from the DOM
const container = document.getElementById('circleCanvas');

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
const wireframeCheckbox = document.getElementById('checked-checkbox');

// Variable to hold the circle mesh
let circle = null;

/**
 * Creates a circle geometry based on the provided radius and segments,
 * and adds it to the scene. If a circle already exists, it is removed first.
 * 
 * @param {number} radius - The radius of the circle.
 * @param {number} segments - The number of segments used to approximate the circle.
 * @param {boolean} wireframe - Defines if the object will display the wireframe.
 */
function createCircle(radius, segments,  wireframe = true) {
    // Remove and dispose of the existing circle if it exists
    if (circle) {
        scene.remove(circle);
        circle.geometry.dispose();
        circle.material.dispose();
        circle = null;
    }

    // Create an array of points for the circle geometry
    const points = [new THREE.Vector3(0, 0, 0)];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * (2 * Math.PI);
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, 0));
    }

    // Create a BufferGeometry from the points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const vertices = points.flatMap(point => [point.x, point.y, point.z]);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Create an index array for the circle mesh
    const indices = [];
    for (let i = 1; i < segments; i++) {
        indices.push(0, i, i + 1);
    }
    indices.push(0, segments, 1);
    geometry.setIndex(indices);

    // Create a mesh with the geometry and a basic wireframe material
    const material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
        wireframe: wireframe
    });
    circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
}

// Initialize the circle with default parameters
createCircle(10, 30);

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
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Update the camera's aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Resize the renderer to match the container size
    renderer.setSize(width - 16, height - 16);
});

// Get radius and segments input elements from the DOM
const radiusInput = document.getElementById('radius-input');
const segmentsInput = document.getElementById('segments-input');

/**
 * Updates the circle based on the current values of the radius and segments inputs.
 */
function updateCircle() {
    const radius = parseFloat(radiusInput.value);
    const segments = parseInt(segmentsInput.value);
    const wireframe = wireframeCheckbox.checked;
    createCircle(radius, segments, wireframe);
}

// Attach event listeners to the inputs to update the circle on change
radiusInput.addEventListener('input', updateCircle);
segmentsInput.addEventListener('input', updateCircle);
wireframeCheckbox.addEventListener('change', () => {
    updateCircle();
});
