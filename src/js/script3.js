import * as THREE from 'three';
import { WebGLRenderer } from 'three';

// create a multiple mesh(multiple cube) using function
function main() {
    const canvas = document.querySelector('#c');
    const renderer = new WebGLRenderer({ canvas });

    // Resize the renderer 
    function rendererNeedToResize(renderer) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = width !== canvas.width || height !== canvas.height;
        if (needResize)
            renderer.setSize(width, height, true);
        return needResize;
    }

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

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // add more instances of cubes
    function addCubes(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }

    // all instance store in the array
    const cubes = [addCubes(geometry, 0xFF0000, -4),
    addCubes(geometry, 0x00FF00, 0),
    addCubes(geometry, 0x0000FF, 4)];


    function render(time) {
        time *= 0.001;
        if (rendererNeedToResize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        cubes.forEach((cube, idx) => {
            const speed = 1 + idx * .1;
            const rotate = time * speed;
            cube.rotation.x = rotate;
            cube.rotation.y = rotate;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    }
    requestAnimationFrame(render);
}

main();

