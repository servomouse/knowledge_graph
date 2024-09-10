// Hardcoded graph structure
const graph = {
	"1234": {
		"text": "Hello world!",
		"links": [2345, 3456]
	},
	"2345": {
		"text": "I am a graph!",
		"links": [1234]
	},
	"3456": {
		"text": "I am a graph!",
		"links": [1234]
	}
};

// Node positions
const nodes = {
	"1234": { x: 150, y: 150 },
	"2345": { x: 300, y: 300 },
	"3456": { x: 300, y: 150 }
};

// Function to draw the graph
function drawGraph(ctx, canvas) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw links
	for (const nodeId in graph) {
		const node = graph[nodeId];
		node.links.forEach(linkedNodeId => {
			const startNode = nodes[nodeId];
			const endNode = nodes[linkedNodeId];
			ctx.beginPath();
			ctx.moveTo(startNode.x, startNode.y);
			ctx.lineTo(endNode.x, endNode.y);
			ctx.strokeStyle = 'black';
			ctx.stroke();
		});
	}

	// Draw nodes
	for (const nodeId in nodes) {
		const node = nodes[nodeId];
		ctx.beginPath();
		ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.stroke();
	}
}

window.onload = function() {
	const canvas = document.getElementById('mainCanvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to match its CSS size
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

let draggingNode = null;
let offsetX, offsetY;

// Function to check if a point is inside a node
function isInsideNode(x, y, node) {
	const dx = x - node.x;
	const dy = y - node.y;
	return dx * dx + dy * dy <= 20 * 20;
}

// Mouse down event to start dragging
canvas.addEventListener('mousedown', (e) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = e.clientX - rect.left;
	const mouseY = e.clientY - rect.top;

	for (const nodeId in nodes) {
		if (isInsideNode(mouseX, mouseY, nodes[nodeId])) {
			draggingNode = nodeId;
			offsetX = mouseX - nodes[nodeId].x;
			offsetY = mouseY - nodes[nodeId].y;
			break;
		}
	}
});

// Mouse move event to drag the node
canvas.addEventListener('mousemove', (e) => {
	if (draggingNode) {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		nodes[draggingNode].x = mouseX - offsetX;
		nodes[draggingNode].y = mouseY - offsetY;

		drawGraph(ctx, canvas);
	}
});

// Mouse up event to stop dragging
canvas.addEventListener('mouseup', () => {
	draggingNode = null;
});

// Initial draw
	drawGraph(ctx, canvas);
};
