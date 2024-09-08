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
	"node4": { "tags": ["tag1"] },
	"node5": { "tags": ["tag1"] },
	"node6": { "tags": ["tag1"] },
	"node7": { "tags": ["tag1"] },
	"node8": { "tags": ["tag1"] },
	"node9": { "tags": ["tag1"] },
	"nodeA": { "tags": ["tag1"] },
	"nodeB": { "tags": ["tag1"] },
	"nodeC": { "tags": ["tag1"] },
	"nodeD": { "tags": ["tag1"] },
	"nodeE": { "tags": ["tag1"] },
	"nodeF": { "tags": ["tag3"] }
};

const nodeObjects = {};
const lines = [];
const geometry = new THREE.SphereGeometry(0.1, 32, 32);
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const radius = 3;

Object.keys(nodes).forEach((nodeKey, index) => {
	const sphere = new THREE.Mesh(geometry, greenMaterial.clone());
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
			lines.push({ line, start: nodeObjects[nodeKey].object, end: nodeObjects[otherNodeKey].object });
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
let autoRotation = true; // Initialize autoRotation to false

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	if (autoRotation) {
		scene.rotation.y += 0.01; // Rotate the scene around the y-axis
	}

	renderer.render(scene, camera);
}


animate();

window.addEventListener('resize', () => {
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
});

renderer.domElement.addEventListener('pointerdown', (event) => {
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

renderer.domElement.addEventListener('pointermove', (event) => {
	console.log("Mouse move event detected");
	if (isDragging && selectedNode) {
		const mouse = new THREE.Vector2();
		mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
		mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, camera);

		// Create a plane parallel to the camera's view direction
		const planeNormal = new THREE.Vector3();
		camera.getWorldDirection(planeNormal);
		const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, selectedNode.position);

		const intersection = new THREE.Vector3();
		raycaster.ray.intersectPlane(plane, intersection);
		
		selectedNode.position.copy(intersection);
		
		// Update the positions of the lines connected to the selected node
		lines.forEach(({ line, start, end }) => {
			if (start === selectedNode || end === selectedNode) {
				const points = [start.position, end.position];
				line.geometry.setFromPoints(points);
			}
		});
	}
});

renderer.domElement.addEventListener('pointerup', () => {
	console.log("Mouse up event detected");
	isDragging = false;
	selectedNode = null;
	controls.enabled = true; // Re-enable controls after dragging
});
