const searchSuggestions = [];
const searchBar = document.getElementById('searchBar');
const suggestionsBox = document.getElementById('suggestions');

searchBar.addEventListener('input', (event) => {
	const query = event.target.value.toLowerCase();
	suggestionsBox.innerHTML = '';
	if (query) {
		const searchArray = query.split(',').map(function(item) { return item.trim();});
		const searchText = searchArray[searchArray.length-1];
		const filteredSuggestions = searchSuggestions.filter(item => item.toLowerCase().includes(searchText));
		filteredSuggestions.forEach(item => {
			const div = document.createElement('div');
			div.classList.add('suggestion');
			div.textContent = item;
			div.addEventListener('click', () => {
				const newArr = searchArray.slice(0, searchArray.length-1);
				newArr.push(item);
				searchBar.value = newArr.join(', ');
				searchBar.focus();
				suggestionsBox.innerHTML = '';
				suggestionsBox.style.display = 'none';
			});
			suggestionsBox.appendChild(div);
		});
		suggestionsBox.style.display = 'block';
	} else {
		suggestionsBox.style.display = 'none';
	}
});

function nodeContainsKeys(node, keys) {
	let contains = true;
	keys.forEach(key => {
		if(key.startsWith("#")) {
			if(!node.tags.includes(key)) {
				contains = false;
			}
		} else if((node.html.indexOf(key) == -1) && (node.title.indexOf(key) == -1)){
			contains = false;
		}
	});
	return contains;
}

function removeSearchResults() {
	let elements = document.getElementsByClassName("card");
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function searchNodes(keys) {
	suggestionsBox.style.display = 'none';
	// console.log(graph);
	selectedNodes = [];
	const cardBox = document.getElementById('cards-container');
	removeSearchResults();
	Object.entries(graph).forEach(([id, node]) => {
		if(nodeContainsKeys(node, keys)) {
			selectedNodes.push(id);
			// const div = document.createElement('div');
			// div.classList.add('card');
			// div.innerHTML = node.title;
			// cardBox.appendChild(div);
		}
	});
	if(selectedNodes.length > 0) {
		console.log("Line 63");
		selectedNodes.forEach((nodeId) => {
			console.log("Line 65");
			const div = document.createElement('div');
			div.classList.add('card');
			div.id = `card_${nodeId}`;
			div.addEventListener("mouseover", function(){highlightedNode = nodeId;drawGraph();});
			div.addEventListener("mouseout", function(){highlightedNode = null;drawGraph();});
			div.addEventListener("click", function(){console.log(`Click on ${nodeId}`);createDraggableNote(graph[nodeId]);});
			// div.onclick = function(){console.log(div.id);};
			div.innerHTML = graph[nodeId].title;
			cardBox.appendChild(div);
		});
	}
	console.log(selectedNodes);
	drawGraph();
}

function doSearch() {
	const keys = searchBar.value.split(',').map(function(item) { return item.trim();});
	console.log('Search for:', keys);
	searchNodes(keys);
}

function testEvent() {
	console.log("lalala");
}

searchBar.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		doSearch();
	}
});

searchBar.addEventListener('input', function() {
	if (searchBar.value === '') {
		removeSearchResults();
		selectedNodes = [];
		drawGraph();
	}
});
