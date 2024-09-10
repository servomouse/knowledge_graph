const editor = pell.init({
	element: document.getElementById('editor-container'),
	onChange: html => console.log(html),
	defaultParagraphSeparator: 'p',
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
