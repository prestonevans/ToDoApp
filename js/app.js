const listContainer = document.querySelector('.task-list');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');

let lists = [
	{
		id: 1,
		name: 'name'
	},
	{
		id: 2,
		name: 'todo'
	}
];

newListForm.addEventListener('submit', (e) => {
	e.preventDefault();
	function invalidInput() {
		return (newListInput.value = null);
	}
	const listName = newListInput.value.trim();
	if (listName === null || listName === '' || listName === 'Enter something valid') {
		newListInput.value = 'Enter something valid';
		setTimeout(invalidInput, 1000);
		return;
	}
	for (let list of lists) {
		if (listName.toLowerCase() === list.name.toLowerCase()) {
			newListInput.value = 'Name already exists';
			setTimeout(invalidInput, 1000);
			return;
		}
	}
	const list = createList(listName);
	newListInput.value = null;
	lists.push(list);
	render();
});

function createList(name) {
	return { id: Date.now().toString(), name: name, tasks: [] };
}

function render() {
	listContainer.innerHTML = '';
	lists.forEach((list) => {
		const listElement = document.createElement('li');
		listElement.dataset.listId = list.id;
		listElement.classList.add('list-name');
		listElement.innerText = list.name;
		listContainer.append(listElement);
	});
}
render();
