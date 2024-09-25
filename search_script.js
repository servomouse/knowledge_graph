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

function nodeContainsTags(node, tags) {
	let contains = true;
	tags.forEach(tag => {
		if(!node.tags.includes(tag)) {
			contains = false;
		}
	});
	return contains;
}

function doSearch() {
	suggestionsBox.style.display = 'none';
	const tags = searchBar.value.split(',').map(function(item) { return item.trim();});
	console.log('Search for:', tags);
	// console.log(graph);
	selectedNodes = [];
	Object.entries(graph).forEach(([id, node]) => {
		if(nodeContainsTags(node, tags)) {
			selectedNodes.push(id);
		}
	});
	console.log(selectedNodes);
	drawGraph();
}

searchBar.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		doSearch();
	}
});
