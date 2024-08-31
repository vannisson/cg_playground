const container = document.getElementById('circleCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ canvas: container });
renderer.setSize(container.clientWidth - 16, container.clientHeight - 16);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

let circle = null;

function createCircle(radius, segments) {
    if (circle) {
        scene.remove(circle);
        circle.geometry.dispose();
        circle.material.dispose();
        circle = null;
    }

    const points = [new THREE.Vector3(0, 0, 0)];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * (2 * Math.PI);
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, 0));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const vertices = [];
    for (let i = 0; i < points.length; i++) {
        vertices.push(points[i].x, points[i].y, points[i].z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const indices = [];
    for (let i = 1; i < segments; i++) {
        indices.push(0, i, i + 1);
    }
    indices.push(0, segments, 1);
    geometry.setIndex(indices);

    const material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
        wireframe: true
    });
    circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
}

createCircle(10, 30);

camera.position.set(0, 5, 20);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const radiusInput = document.getElementById('radius-input');
const segmentsInput = document.getElementById('segments-input');

function updateCircle() {
    const radius = parseFloat(radiusInput.value);
    const segments = parseInt(segmentsInput.value);
    createCircle(radius, segments);
}

radiusInput.addEventListener('input', updateCircle);
segmentsInput.addEventListener('input', updateCircle);
