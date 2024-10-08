let editedNode = null;

const editor = pell.init({
	element: document.getElementById('pell-editor-id'),
	onChange: () => {},
	defaultParagraphSeparator: 'div',
	styleWithCSS: true,
	actions: [
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'heading1',
		'heading2',
		'paragraph',
		'quote',
		'code',
		'link',
		'image'
	],
	classes: {
		actionbar: 'pell-actionbar',
		button: 'pell-button',
		content: 'pell-content',
		selected: 'pell-button-selected'
	}
});

// Fix to remove the initial empty paragraph
document.querySelector('.pell-content').addEventListener('input', function() {
	const content = this.innerHTML;
	if (content === '<p><br></p>') {
		this.innerHTML = '';
	}
});

// Set the editor content area to fit the container
editor.content.style.height = 'calc(100% - 40px)'; // Adjust for action bar height


// Function to load a document into the editor
function loadDocument(content) {
	editor.content.innerHTML = content;
}

// Function to get the current document content from the editor
function getDocumentContent() {
	return editor.content.innerHTML;
}

function pellCancel() {
	document.getElementById('pell-container').style.display = 'none';
	document.getElementById('overlay').classList.remove('visible');
}

function createNewNoteFunc() {
	const pellContainer = document.querySelector(".pell-container");
	const pellTitle = document.querySelector("#pell-title").value;
	const pellText = document.querySelector(".pell-content").innerHTML;
	const pellTags = document.querySelector("#pell-tags").value.split(', ');
	const timestamp = Math.floor(Date.now()/1000);
	if(editedNode) {
		graph[editedNode].html = pellText;
		graph[editedNode].title = pellTitle;
		graph[editedNode].tags = pellTags;
		graph[editedNode].last_open = timestamp;
		editedNode = null;
	} else {
		addElementToGraph({
			'id': timestamp,
			'last_open': timestamp,
			'html': pellText,
			'title': pellTitle,
			'tags': pellTags.map(element => element.trim()),
			'coords': {'x': Math.floor(Math.random() * 100) + 10, 'y': Math.floor(Math.random() * 100) + 10}
		}, `${timestamp}`);
	}
	drawGraph();
	console.log(`${pellTitle}`)
	console.log(`${pellText}`)
	console.log(`${pellTags}`)
	document.getElementById('pell-container').style.display = 'none';
	document.getElementById('overlay').classList.remove('visible');
	// if (!pellContainer.classList.contains('pell-hidden')) {
	// 	pellContainer.classList.add('pell-hidden');
	// }
	console.log("New note created!");
}

function addNewNoteFunc() {
	// const pellContainer = document.querySelector(".pell-container");
	editedNode = null;
	
	document.getElementById('pell-container').style.display = 'block'; // or 'flex' if you prefer
	document.getElementById('overlay').classList.add('visible');
	// if (pellContainer.classList.contains('pell-hidden')) {
	// 	pellContainer.classList.remove('pell-hidden');
	// }
	console.log("New note added!");
}

function editNoteFunc(nodeId) {
	// const pellContainer = document.querySelector(".pell-container");
	const node = graph[nodeId];
	editedNode = nodeId;
	document.querySelector("#pell-title").value = node.title;
	document.querySelector(".pell-content").innerHTML = node.html;
	document.querySelector("#pell-tags").value = node.tags.join(", ");
	
	document.getElementById('pell-container').style.display = 'block'; // or 'flex' if you prefer
	document.getElementById('overlay').classList.add('visible');
	// if (pellContainer.classList.contains('pell-hidden')) {
	// 	pellContainer.classList.remove('pell-hidden');
	// }
	console.log("New note added!");
}
