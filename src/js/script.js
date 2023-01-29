import * as THREE from 'three';
import { Scene } from 'three';

function main() {

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 10;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    const scene = new THREE.Scene();
    const boxWidth = 2;
    const boxHeight = 2;
    const boxDepth = 2;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    function render(time) {
        time *= 0.001;
        cube.rotation.x = time;
        cube.rotation.y = time;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();