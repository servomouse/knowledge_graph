const suggestions = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape"];
const searchBar = document.getElementById('searchBar');
const suggestionsBox = document.getElementById('suggestions');

searchBar.addEventListener('input', (event) => {
	const query = event.target.value.toLowerCase();
	suggestionsBox.innerHTML = '';
	if (query) {
		const filteredSuggestions = suggestions.filter(item => item.toLowerCase().includes(query));
		filteredSuggestions.forEach(item => {
			const div = document.createElement('div');
			div.classList.add('suggestion');
			div.textContent = item;
			div.addEventListener('click', () => {
				searchBar.value = item;
				suggestionsBox.innerHTML = '';
			});
			suggestionsBox.appendChild(div);
		});
		suggestionsBox.style.display = 'block';
	} else {
		suggestionsBox.style.display = 'none';
	}
});

searchBar.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		console.log('Search for:', searchBar.value);
		suggestionsBox.style.display = 'none';
	}
});
