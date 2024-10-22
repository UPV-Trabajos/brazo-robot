import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Piso
const floorSize = 1000;
const halfFloorSize = floorSize / 2;
const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// Material sólido con luz
const material = new THREE.MeshPhongMaterial({ color: 'skyblue', shininess: 100 });
const robot = new THREE.Group();

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(100, 100, 100).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Base
const baseGeometry = new THREE.CylinderGeometry(50, 50, 15, 32);
const base = new THREE.Mesh(baseGeometry, material);
base.position.set(0, 9, 0);
robot.add(base);

// Brazo
const brazo = new THREE.Group();
const ejeGeometry = new THREE.CylinderGeometry(20, 20, 18, 32);
const eje = new THREE.Mesh(ejeGeometry, material);
eje.position.set(0, 21, 0);
eje.rotation.z = Math.PI / 2;

const esparragoGeometry = new THREE.BoxGeometry(18, 120, 12);
const esparrago = new THREE.Mesh(esparragoGeometry, material);
esparrago.position.set(0, 81, 0);
esparrago.rotation.y = Math.PI / 2;

const rotulaGeometry = new THREE.SphereGeometry(20, 20, 20);
const rotula = new THREE.Mesh(rotulaGeometry, material);
rotula.position.set(0, 140, 0);

brazo.add(eje);
brazo.add(esparrago);
brazo.add(rotula);
base.add(brazo);

// Antebrazo
const antebrazo = new THREE.Group();
const discoGeometry = new THREE.CylinderGeometry(22, 22, 6, 32);
const disco = new THREE.Mesh(discoGeometry, material);
disco.position.set(0, 0, 0);

const nerviosGeometry = new THREE.BoxGeometry(4, 80, 4);
const nervio1 = new THREE.Mesh(nerviosGeometry, material);
nervio1.position.set(8, 40, 8);
const nervio2 = new THREE.Mesh(nerviosGeometry, material);
nervio2.position.set(-8, 40, 8);
const nervio3 = new THREE.Mesh(nerviosGeometry, material);
nervio3.position.set(8, 40, -8);
const nervio4 = new THREE.Mesh(nerviosGeometry, material);
nervio4.position.set(-8, 40, -8);

const manoGeometry = new THREE.CylinderGeometry(15, 15, 40, 32);
const mano = new THREE.Mesh(manoGeometry, material);
mano.position.set(0, 80, 0);
mano.rotation.z = Math.PI / 2;

// Pinzas (left and right)
const pinzaIzq = new THREE.Group();
const pinzaIzqSquareGeometry = new THREE.BoxGeometry(19, 20, 4);
const pinzaIzqSquare = new THREE.Mesh(pinzaIzqSquareGeometry, material);
pinzaIzqSquare.position.set(0, -10, 10);
pinzaIzqSquare.rotation.x = Math.PI / 2;
pinzaIzq.add(pinzaIzqSquare);

const pinzaParallelipipedIzqGeometry = new THREE.BufferGeometry();
const verticesPinzaIzq = new Float32Array([
  19, 20, 0, 0, 16, -2, 0, 4, -2, 19, 0, 0,
  19, 20, -4, 19, 0, -4, 0, 4, -4, 0, 16, -4,
  19, 20, -4, 0, 16, -4, 0, 16, -2, 19, 20, 0,
  19, 0, 0, 0, 4, -2, 0, 4, -4, 19, 0, -4,
  19, 20, 0, 19, 0, 0, 19, 0, -4, 19, 20, -4,
  0, 16, -2, 0, 16, -4, 0, 4, -4, 0, 4, -2
]);

pinzaParallelipipedIzqGeometry.setAttribute('position', new THREE.BufferAttribute(verticesPinzaIzq, 3));
pinzaParallelipipedIzqGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array([
  0, 1, 3, 1, 2, 3, 4, 5, 7, 5, 6, 7,
  8, 9, 10, 8, 10, 11, 12, 13, 15, 13, 14, 15,
  16, 17, 19, 17, 18, 19, 20, 21, 23, 21, 22, 23
]), 1));

pinzaParallelipipedIzqGeometry.computeVertexNormals();

const pinzaParallelipipedIzq = new THREE.Mesh(pinzaParallelipipedIzqGeometry, material);
pinzaParallelipipedIzq.position.set(10, -8, 38.5);
pinzaParallelipipedIzq.rotation.z = Math.PI / 2;
pinzaParallelipipedIzq.rotation.x = -Math.PI / 2;
pinzaIzq.add(pinzaParallelipipedIzq);
mano.add(pinzaIzq);

const pinzaDer = new THREE.Group();
const pinzaDerSquareGeometry = new THREE.BoxGeometry(19, 20, 4);
const pinzaDerSquare = new THREE.Mesh(pinzaDerSquareGeometry, material);
pinzaDerSquare.position.set(0, 10, 10);
pinzaDerSquare.rotation.x = Math.PI / 2;
pinzaDer.add(pinzaDerSquare);

const pinzaParallelipipedDer = pinzaParallelipipedIzq.clone();
pinzaParallelipipedDer.position.set(10, 12, 38.5);
pinzaDer.add(pinzaParallelipipedDer);

mano.add(pinzaDer);

antebrazo.add(disco);
antebrazo.add(nervio1);
antebrazo.add(nervio2);
antebrazo.add(nervio3);
antebrazo.add(nervio4);
antebrazo.add(mano);

robot.add(brazo);
rotula.add(antebrazo);
scene.add(robot);

camera.position.set(0, 400, 280);

const controls = new OrbitControls(camera, renderer.domElement);

// Variables de velocidad
const velocidadMovimiento = 2;
let keyStates = {};

// Detectar teclas presionadas
window.addEventListener('keydown', (event) => {
  keyStates[event.code] = true;
});

window.addEventListener('keyup', (event) => {
  keyStates[event.code] = false;
});

// Limitar el movimiento a los límites del piso
function moverRobot() {
  if (keyStates['ArrowUp']) {
    robot.position.z = Math.max(robot.position.z - velocidadMovimiento, -halfFloorSize + 50);
  }
  if (keyStates['ArrowDown']) {
    robot.position.z = Math.min(robot.position.z + velocidadMovimiento, halfFloorSize - 50);
  }
  if (keyStates['ArrowLeft']) {
    robot.position.x = Math.max(robot.position.x - velocidadMovimiento, -halfFloorSize + 50);
  }
  if (keyStates['ArrowRight']) {
    robot.position.x = Math.min(robot.position.x + velocidadMovimiento, halfFloorSize - 50);
  }
}

// Añadir GUI para controlar el robot
const gui = new GUI();
const robotControls = {
  giroBase: 0,
  giroBrazo: 0,
  giroAntebrazoY: 0,
  giroAntebrazoZ: 0,
  giroPinza: 0,
  separacionPinza: 10,
  alambres: false,
  animar() {
    // Tomar los valores actuales y los límites de cada control desde la GUI
    const baseRotationMin = THREE.MathUtils.degToRad(-180);
    const baseRotationMax = THREE.MathUtils.degToRad(180);
    const brazoRotationMin = THREE.MathUtils.degToRad(-45);
    const brazoRotationMax = THREE.MathUtils.degToRad(45);
    const antebrazoRotationYMin = THREE.MathUtils.degToRad(-180);
    const antebrazoRotationYMax = THREE.MathUtils.degToRad(180);
    const antebrazoRotationZMin = THREE.MathUtils.degToRad(-90);
    const antebrazoRotationZMax = THREE.MathUtils.degToRad(90);
    const manoRotationMin = THREE.MathUtils.degToRad(-90);
    const manoRotationMax = THREE.MathUtils.degToRad(90);
    const pinzaRotationMin = THREE.MathUtils.degToRad(-40);
    const pinzaRotationMax = THREE.MathUtils.degToRad(220);
    const separacionPinzaMin = 0;
    const separacionPinzaMax = 15;

    // Animación de la base
    const baseTween = new TWEEN.Tween(robot.rotation)
      .to({ y: baseRotationMax }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .repeat(Infinity)
      .yoyo(true);

    // Animación del brazo
    const brazoTween = new TWEEN.Tween(brazo.rotation)
      .to({ x: brazoRotationMax }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .repeat(Infinity)
      .yoyo(true);

    // Animación del antebrazo
    const antebrazoTweenY = new TWEEN.Tween(antebrazo.rotation)
      .to({ y: antebrazoRotationYMax }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .repeat(Infinity)
      .yoyo(true);

    const antebrazoTweenZ = new TWEEN.Tween(rotula.rotation)
      .to({ x: antebrazoRotationZMax }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .repeat(Infinity)
      .yoyo(true);

    // Animación del cilindro (mano) en el eje x (igual que giroPinza)
    const manoTween = new TWEEN.Tween(mano.rotation)
      .to({ x: pinzaRotationMax }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .repeat(Infinity)
      .yoyo(true);

    // Animación del giro de la pinza
    const giroPinzaTween = new TWEEN.Tween(mano.rotation)
      .to({ x: pinzaRotationMax }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .repeat(Infinity)
      .yoyo(true);

    // Animación de la apertura de la pinza (separación)
    const separacionPinzaTween = new TWEEN.Tween({ separacion: separacionPinzaMin })
      .to({ separacion: separacionPinzaMax }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .repeat(Infinity)
      .yoyo(true)
      .onUpdate(({ separacion }) => {
        pinzaIzq.position.y = -10 + separacion;
        pinzaDer.position.y = 10 - separacion;
      });

    // Iniciar las animaciones
    baseTween.start();
    brazoTween.start();
    antebrazoTweenY.start();
    antebrazoTweenZ.start();
    manoTween.start(); // Animación del cilindro en el eje x
    giroPinzaTween.start();
    separacionPinzaTween.start();
  }
};

gui.add(robotControls, 'giroBase', -180, 180).onChange((value) => {
  robot.rotation.y = THREE.MathUtils.degToRad(value);
});
gui.add(robotControls, 'giroBrazo', -45, 45).onChange((value) => {
  brazo.rotation.x = THREE.MathUtils.degToRad(value);
});
gui.add(robotControls, 'giroAntebrazoY', -180, 180).onChange((value) => {
  antebrazo.rotation.y = THREE.MathUtils.degToRad(value);
});
gui.add(robotControls, 'giroAntebrazoZ', -90, 90).onChange((value) => {
  rotula.rotation.x = THREE.MathUtils.degToRad(value);
});
gui.add(robotControls, 'giroPinza', -40, 220).onChange((value) => {
  mano.rotation.x = THREE.MathUtils.degToRad(-value);
});
gui.add(robotControls, 'separacionPinza', 0, 15).onChange((value) => {
  pinzaIzq.position.y = -10 + value;
  pinzaDer.position.y = 10 - value;
});
gui.add(robotControls, 'alambres').onChange((value) => {
  material.wireframe = value;
});
gui.add(robotControls, 'animar').name('Animar');

// Bucle de animación
function animate() {
  requestAnimationFrame(animate);

  // Lógica de movimiento con límites
  moverRobot();

  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
}

animate();
