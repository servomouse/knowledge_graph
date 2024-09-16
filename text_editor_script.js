const editor = pell.init({
	element: document.getElementById('pell-editor-id'),
	onChange: html => console.log(html),
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

function createNewNoteFunc() {
	const pellContainer = document.querySelector(".pell-container");
	if (!pellContainer.classList.contains('pell-hidden')) {
		pellContainer.classList.add('pell-hidden');
	}
	console.log("New note created!");
}

function addNewNoteFunc() {
	const pellContainer = document.querySelector(".pell-container");
	if (pellContainer.classList.contains('pell-hidden')) {
		pellContainer.classList.remove('pell-hidden');
	}
	console.log("New note added!");
}
