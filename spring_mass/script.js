// Cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adicionando controle de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // habilitar damping para uma rotação mais suave

// Cor do suporte (azul)
const supportColor = 0x0000ff;

// Criando a geometria e o material para o suporte
const baseGeometry = new THREE.BoxGeometry(10, 0.5, 2); // geometria do suporte
const baseMaterial = new THREE.MeshBasicMaterial({ color: supportColor });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

// Criando a "parede" em uma das extremidades do suporte
const wallGeometry = new THREE.BoxGeometry(0.5, 2, 2); // parede lateral (ajuste a altura, largura e espessura)
const wallMaterial = new THREE.MeshBasicMaterial({ color: supportColor });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);

// Posicionando a parede na extremidade esquerda do suporte
wall.position.set(-4.75, 1.25, 0); // ajuste a posição (altura e lateral) para que esteja no lugar correto
scene.add(wall);

// Cor das rodas (preto)
const wheelColor = 0xffffff;

// Função para criar uma roda
function createWheel() {
  const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32); // Raio 0.5, profundidade 0.3
  const wheelMaterial = new THREE.MeshBasicMaterial({ color: wheelColor });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.rotation.z = Math.PI / 4; // Rodar a roda no eixo Z para ficar de lado
  wheel.rotation.x = THREE.Math.degToRad(-90); // Rodar a roda no eixo Z para ficar de lado
  return wheel;
}

// Criando e posicionando as rodas
const wheel1 = createWheel();
wheel1.position.set(-4, -0.25, 1.25); // Roda traseira esquerda
scene.add(wheel1);

const wheel2 = createWheel();
wheel2.position.set(-4, -0.25, -1.25); // Roda traseira direita
scene.add(wheel2);

const wheel3 = createWheel();
wheel3.position.set(4, -0.25, 1.25); // Roda dianteira esquerda
scene.add(wheel3);

const wheel4 = createWheel();
wheel4.position.set(4, -0.25, -1.25); // Roda dianteira direita
scene.add(wheel4);

// Posição inicial da câmera
camera.position.set(15, 15, 15);
camera.lookAt(0, 0, 0);

// Ajuste do controle de órbita
controls.update();

// Loop de animação
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // atualiza os controles de órbita
  renderer.render(scene, camera);
}
animate();

// Ajustar a tela ao redimensionar a janela
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
