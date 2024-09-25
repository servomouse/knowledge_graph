let graph = null;
let selectedNodes = [];

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

function set_graph(jsonData) {
	graph = jsonData;
}

function addElementToGraph(node, name) {
	graph[name] = node;
}

function drawGraph() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw links
	for (const CurrentNodeId in graph) {
		const node = graph[CurrentNodeId];
		let linkedNodes = []
		for (const nodeId in graph) {
			if(CurrentNodeId != nodeId) {
				node.tags.forEach(nodeTag => {
					if(graph[nodeId].tags.includes(nodeTag)) {
						linkedNodes.push(nodeId);
					}
				});
			}
		}
		// const node = graph[nodeId];
		linkedNodes.forEach(linkedNodeId => {
			// const startNode = nodes[CurrentNodeId];
			// const endNode = nodes[linkedNodeId];
			ctx.beginPath();
			ctx.moveTo(node.coords.x, node.coords.y);
			ctx.lineTo(graph[linkedNodeId].coords.x, graph[linkedNodeId].coords.y);
			ctx.strokeStyle = 'black';
			ctx.stroke();
		});
	}

	// Draw nodes
	for (const nodeId in graph) {
		const node = graph[nodeId];
		ctx.beginPath();
		ctx.arc(node.coords.x, node.coords.y, 20, 0, 2 * Math.PI);
		if(selectedNodes.includes(nodeId)) {
			ctx.fillStyle = 'yellow';
		} else {
			ctx.fillStyle = 'blue';
		}
		ctx.fill();
		ctx.stroke();
	}
	textIsDrawn = false;
}

let draggingNode = null;
let wasdraggingNode = false;
let offsetX, offsetY;
let hoverTimeout;
let isMouseDown = false;
let textIsDrawn = false;

// Function to check if a point is inside a node
function isInsideNode(x, y, node) {
	const dx = x - node.x;
	const dy = y - node.y;
	return dx * dx + dy * dy <= 20 * 20;
}

function mouseDownEvent(e, ctx, canvas) {
	isMouseDown = true;
	console.log("Mouse down event detected!");
	const rect = canvas.getBoundingClientRect();
	const mouseX = e.clientX - rect.left;
	const mouseY = e.clientY - rect.top;

	for (const nodeId in graph) {
		if (isInsideNode(mouseX, mouseY, graph[nodeId].coords)) {
			draggingNode = nodeId;
			offsetX = mouseX - graph[nodeId].coords.x;
			offsetY = mouseY - graph[nodeId].coords.y;
			break;
		}
	}
}

function mouseMoveEvent(e, ctx, canvas) {
	if (draggingNode) {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		graph[draggingNode].coords.x = mouseX - offsetX;
		graph[draggingNode].coords.y = mouseY - offsetY;

		clearTimeout(hoverTimeout);

		drawGraph();
		if (!wasdraggingNode) {
			wasdraggingNode = true;
		}
	} else {
		if (wasdraggingNode) {
			wasdraggingNode = false;
		}
	}
	const rect = canvas.getBoundingClientRect();
	const mouseX = e.clientX - rect.left;
	const mouseY = e.clientY - rect.top;

	if(isMouseDown) {
		return;
	}
	let hoveredNode = null;
	for (const nodeId in graph) {
		if (isInsideNode(mouseX, mouseY, graph[nodeId].coords)) {
			hoveredNode = nodeId;
			break;
		}
	}

	if (hoveredNode) {
		clearTimeout(hoverTimeout);
		hoverTimeout = setTimeout(() => {console.log('Node hovered:', hoveredNode); drawTooltip(graph[hoveredNode].title, graph[hoveredNode].coords.x, graph[hoveredNode].coords.y)}, 300);
	} else {
		if(textIsDrawn) {
			drawGraph();	// Remove text
		}
		clearTimeout(hoverTimeout);
	}
}

function drawTooltip(text, x, y) {
	drawGraph();
	ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';	// Semitransparent black
	const padding = 5;
	const textWidth = ctx.measureText(text).width;
	const textHeight = 16;
	ctx.fillRect(x+10, y-10-padding, textWidth+(2*padding), textHeight+(2*padding));
	ctx.fillStyle = 'white';
	ctx.font = '14px Arial';
	ctx.fillText(text, x+10+padding, y-10-padding+textHeight+2);
	textIsDrawn = true;
}

function mouseUpEvent(e, ctx, canvas) {
	isMouseDown = false;
	console.log("Mouse up detected");
	draggingNode = null;
}

function mouseClickEvent(e, ctx, canvas) {
	const rect = canvas.getBoundingClientRect();
	const mouseX = e.clientX - rect.left;
	const mouseY = e.clientY - rect.top;

	for (const nodeId in graph) {
		if (isInsideNode(mouseX, mouseY, graph[nodeId].coords) && !wasdraggingNode) {
			console.log('Node clicked:', nodeId);
			if (!document.getElementById(graph[nodeId].id)) {
				createDraggableNote(graph[nodeId]);
			}
			break;
		}
	}
}

window.onload = function() {

	canvas.width = canvas.clientWidth;	// Set canvas size to match its CSS size
	canvas.height = canvas.clientHeight;

	canvas.addEventListener('mousedown', (e) => {mouseDownEvent(e, ctx, canvas)});
	canvas.addEventListener('mousemove', (e) => {mouseMoveEvent(e, ctx, canvas)});
	canvas.addEventListener('mouseup', (e) => {mouseUpEvent(e, ctx, canvas)});
	canvas.addEventListener('click', (e) => {mouseClickEvent(e, ctx, canvas)});

	// set_graph(null);
	drawGraph();	// Initial draw
};

function tagClickHandler(tagName) {
	console.log(`${tagName} clicked`);
	const searchBar = document.getElementById('searchBar');
	searchBar.value += `${tagName} `;
	searchBar.focus();
}

function createDraggableNote(node) {
	const mainContainer = document.createElement('div');
	mainContainer.classList.add('dynamic-container');
	mainContainer.style.left = `${node.coords.x}px`;
	mainContainer.style.top = `${node.coords.y}px`;
	mainContainer.id = node.id;

	const titleBar = document.createElement('div');
	titleBar.classList.add('dynamic-title-bar');
	titleBar.innerHTML = node.title;
	mainContainer.appendChild(titleBar);

	const editButton = document.createElement('div');
	editButton.classList.add('dynamimc-edit-button');
	editButton.title = "Edit";
	mainContainer.appendChild(editButton);

	const closeButton = document.createElement('div');
	closeButton.classList.add('dynamic-close-button');
	closeButton.title = "Close";
	mainContainer.appendChild(closeButton);

	const contentDiv = document.createElement('div');
	contentDiv.classList.add('dynamic-content-div');
	let html_code = node.html;
	const styleSection = "<style>.footer {position: absolute;left: 0;bottom: 0;width: 100%;text-align: center;}</style>"
	html_code = html_code.replace("</head>", `${styleSection}</head>`);
	const tagsList = node.tags.map(word => `<span class="tag-word">${word}</span>`).join(" ");
	const footerDiv = `<div class='footer'>${tagsList}</div>`;
	html_code = html_code.replace("</body>", `${footerDiv}</body>`);
	contentDiv.innerHTML = html_code;
	mainContainer.appendChild(contentDiv);

	const tagsElements = contentDiv.getElementsByClassName('tag-word');
	for(let tag of tagsElements) {
		tag.addEventListener('click', function() {
			tagClickHandler(tag.textContent);
		});
	}

	document.body.appendChild(mainContainer);

	titleBar.addEventListener('mousedown', function(e) {
		let offsetX = e.clientX - mainContainer.getBoundingClientRect().left;
		let offsetY = e.clientY - mainContainer.getBoundingClientRect().top;

		function mouseMoveHandler(e) {
			mainContainer.style.left = `${e.clientX - offsetX}px`;
			mainContainer.style.top = `${e.clientY - offsetY}px`;
		}

		function mouseUpHandler() {
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		}

		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	});

	closeButton.addEventListener('click', function() {
		mainContainer.remove();
	});
}
