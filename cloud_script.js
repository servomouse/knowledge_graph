import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';

const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const width = container.clientWidth;
const height = container.clientHeight;
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

camera.position.z = 5;

const nodes = {
	"node0": { "tags": ["tag3"] },
	"node1": { "tags": ["tag1", "tag2", "tag3"] },
	"node2": { "tags": ["tag1"] },
	"node3": { "tags": ["tag1"] },
	"node4": { "tags": ["tag2"] },
	"node5": { "tags": ["tag3"] },
	"node6": { "tags": ["tag3"] },
	"node7": { "tags": ["tag3"] },
	"node8": { "tags": ["tag3"] },
	"node9": { "tags": ["tag3"] },
	"nodeA": { "tags": ["tag3"] },
	"nodeB": { "tags": ["tag3"] },
	"nodeC": { "tags": ["tag3"] },
	"nodeD": { "tags": ["tag3"] },
	"nodeE": { "tags": ["tag3"] },
	"nodeF": { "tags": ["tag3"] }
};

const nodeObjects = {};
const geometry = new THREE.SphereGeometry(0.1, 32, 32);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const radius = 3;

Object.keys(nodes).forEach((nodeKey, index) => {
	const sphere = new THREE.Mesh(geometry, greenMaterial.clone());
	// sphere.position.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
	// Generate random spherical coordinates
	const theta = Math.random() * 2 * Math.PI; // Random angle in the xy-plane
	const phi = Math.acos(2 * Math.random() - 1); // Random angle from the z-axis

	// Convert spherical coordinates to Cartesian coordinates
	const x = radius * Math.sin(phi) * Math.cos(theta);
	const y = radius * Math.sin(phi) * Math.sin(theta);
	const z = radius * Math.cos(phi);

	sphere.position.set(x, y, z);
	scene.add(sphere);
	nodeObjects[nodeKey] = { object: sphere, tags: nodes[nodeKey].tags };
});

Object.keys(nodeObjects).forEach(nodeKey => {
Object.keys(nodeObjects).forEach(otherNodeKey => {
if (nodeKey !== otherNodeKey && nodeObjects[nodeKey].tags.some(tag => nodeObjects[otherNodeKey].tags.includes(tag))) {
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
const points = [];
points.push(nodeObjects[nodeKey].object.position);
points.push(nodeObjects[otherNodeKey].object.position);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
scene.add(line);
}
});
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2; // Set the minimum zoom distance
controls.maxDistance = 10; // Set the maximum zoom distance
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.05; // Set the damping factor

let selectedNode = null;
let isDragging = false;

function animate() {
requestAnimationFrame(animate);
controls.update();
renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
camera.aspect = width / height;
camera.updateProjectionMatrix();
renderer.setSize(width, height);
});

// renderer.domElement.addEventListener('click', (event) => {
// 	const mouse = new THREE.Vector2();
// 	mouse.x = (event.clientX / width) * 2 - 1;
// 	mouse.y = -(event.clientY / height) * 2 + 1;

// 	const raycaster = new THREE.Raycaster();
// 	raycaster.setFromCamera(mouse, camera);

// 	// const intersects = raycaster.intersectObjects(scene.children);
// 	// Filter out only the node objects (spheres)
// 	const nodeObjectsArray = Object.values(nodeObjects).map(node => node.object);
// 	const intersects = raycaster.intersectObjects(nodeObjectsArray);
// 	if (intersects.length > 0) {
// 		const selectedNode = intersects[0].object;
// 		console.log('Selected node:', selectedNode);
// 		if (selectedNode.material.color.getHex() === 0x00ff00) {
// 			selectedNode.material.color.setHex(0xff0000);
// 		} else {
// 			selectedNode.material.color.setHex(0x00ff00);
// 		}
// 	}
// });

renderer.domElement.addEventListener('mousedown', (event) => {
	console.log("Mouse down event detected");
	const mouse = new THREE.Vector2();
	mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
	mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(Object.values(nodeObjects).map(node => node.object));
	if (intersects.length > 0) {
		selectedNode = intersects[0].object;
		console.log('Selected node:', selectedNode);
		isDragging = true;
		controls.enabled = false; // Disable controls while dragging
	}
});

renderer.domElement.addEventListener('mousemove', (event) => {
	if (isDragging && selectedNode) {
		const mouse = new THREE.Vector2();
		mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
		mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, camera);

		const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
		const intersection = new THREE.Vector3();
		raycaster.ray.intersectPlane(plane, intersection);

		selectedNode.position.copy(intersection);
	}
});

renderer.domElement.addEventListener('mouseup', () => {
	isDragging = false;
	selectedNode = null;
	controls.enabled = true; // Re-enable controls after dragging
});
