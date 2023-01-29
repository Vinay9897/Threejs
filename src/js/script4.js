import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import nebula from '../img/nebula.jpg';
import star from '../img/stars.jpg';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const monkeyURL = new URL('../assets/monkey.glb', import.meta.url);
const renderer = new T.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new T.Scene();

const camera = new T.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1, 1000
);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);

//Plane
const planeGeometry = new T.PlaneGeometry(10, 10);
const planeMaterial = new T.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: T.DoubleSide
});
const plane = new T.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * 3.14;
scene.add(plane);

//Grid
const grid = new T.GridHelper(10);
grid.rotation.y = -0.5 * 3.14;
scene.add(grid);

//Axes
const axeshelper = new T.AxesHelper(5);
scene.add(axeshelper);
orbit.update();

// Box
const boxgeometry = new T.BoxGeometry();
const material = new T.MeshStandardMaterial({ color: 0x00FF00 });
const box = new T.Mesh(boxgeometry, material);
scene.add(box);

//sphere
const sphereGeometry = new T.SphereGeometry(1, 15, 15);
const sphereMaterial = new T.MeshStandardMaterial({ color: 0x00FF00 });
const sphere = new T.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-3, -3, 0);
scene.add(sphere);
sphere.castShadow = true;

// light
// const ambient = new T.AmbientLight(0x333333);
// scene.add(ambient);
// const directionlight = new T.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionlight);
// directionlight.position.set(-30, 20, 0);
// directionlight.castShadow = true;
// directionlight.shadow.camera.bottom = -12;

// const directionlightHelper = new T.DirectionalLightHelper(directionlight, 1);
// scene.add(directionlightHelper);
// directionlightHelper.position.set(30, -20, 0);
// const dlightShadowHelper = new T.CameraHelper(directionlight.shadow.camera);
// scene.add(dlightShadowHelper);


// spotlight
const spotlight = new T.SpotLight(0xFFFFFF);
scene.add(spotlight);
spotlight.position.set(-100, 100, 0);
spotlight.castShadow = true;


const spotlightHelper = new T.SpotLightHelper(spotlight);
scene.add(spotlightHelper);


//fog
scene.fog = new T.Fog(0xFFFFFF, 0, 100);
// renderer.setClearColor(0x00FFEA00);

//texture

const textureLoader = new T.TextureLoader();
// scene.background = textureLoader.load(star);
const cubetextureLoader = new T.CubeTextureLoader();
scene.background = cubetextureLoader.load([
    nebula,
    nebula,
    star,
    star,
    star,
    star
]);

//Box2Geometry

const box2geometry = new T.BoxGeometry(3, 3, 3);
const material2 = new T.MeshStandardMaterial({
    color: 0x00FF00,
    map: textureLoader.load(nebula)
});
// box2MulitMaterial
const box2MulitMaterial = [
    new T.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
    new T.MeshBasicMaterial({ map: textureLoader.load(star) }),
    new T.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
    new T.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
    new T.MeshBasicMaterial({ map: textureLoader.load(star) }),
    new T.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
];

const box2 = new T.Mesh(box2geometry, box2MulitMaterial);
scene.add(box2);
box2.position.set(2, 2, 2);
const gui = new dat.GUI();
const option = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    intensity: 1,
    penumbra: 0.2,
};

const assetLoader = new GLTFLoader();

assetLoader.load(monkeyURL.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-2, 3, -5);
}, undefined, function () {
    console.error(error);
});


gui.addColor(option, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});
gui.add(option, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e;
})
gui.add(option, 'speed', 0, 0.1);
gui.add(option, 'angle', 0, 1);
gui.add(option, 'penumbra', 0, 1);
gui.add(option, 'intensity', 0, 1);

let step = 0;


// window.addEventListener('mousemove', function (e) {
//     mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
//     mousePosition.y = (e.clientY / this.window.innerHeight) * 2 + 1;
// });


function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    step += option.speed;
    spotlight.angle = option.angle;
    spotlight.intensity = option.intensity;
    spotlight.penumbra = option.penumbra;
    // spotlightHelper.update();
    sphere.position.y = Math.abs(Math.sin(step)) * 5;
    box2.position.z = Math.abs(Math.sin(step)) * 5;

    // rayCaster.setFromCamera(mousePosition, camera);
    // const intersects = rayCaster.intersectObjects(scene.childern);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//resize window

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(window.innerWidth, window.innerHeight);
});




