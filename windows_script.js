function createDraggableNote() {
	const mainDiv = document.createElement('div');
	mainDiv.classList.add('mainDiv');

	const div1 = document.createElement('div');
	div1.classList.add('div1');
	mainDiv.appendChild(div1);

	const div2 = document.createElement('div');
	div2.classList.add('div2');
	mainDiv.appendChild(div2);

	const div3 = document.createElement('div');
	div3.classList.add('div3');
	mainDiv.appendChild(div3);

	document.body.appendChild(mainDiv);

	div1.addEventListener('mousedown', function(e) {
		let offsetX = e.clientX - mainDiv.getBoundingClientRect().left;
		let offsetY = e.clientY - mainDiv.getBoundingClientRect().top;

		function mouseMoveHandler(e) {
			mainDiv.style.left = `${e.clientX - offsetX}px`;
			mainDiv.style.top = `${e.clientY - offsetY}px`;
		}

		function mouseUpHandler() {
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		}

		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	});

	div2.addEventListener('click', function() {
		mainDiv.remove();
	});
}
