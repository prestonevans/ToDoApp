const listContainer = document.querySelector('.task-list');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteList = document.querySelectorAll('.delete')[1];

const taskListDisplay = document.querySelector('.todo-list');
const title = document.querySelector('.list-title');
const count = document.querySelector('.task-count');
const tasks = document.querySelector('.todo-body');

console.log(tasks);
console.log(count);
console.log(title);
console.log(taskListDisplay);
const LocalStorageList = 'list';
const LocalStorageActiveList = 'active.list';

let lists = JSON.parse(localStorage.getItem(LocalStorageList)) || [];
let SelectedList = localStorage.getItem(LocalStorageActiveList);

listContainer.addEventListener('click', (e) => {
	if (e.target.tagName.toLowerCase() === 'li') {
		e.target.classList.add('active-list');
		SelectedList = e.target.dataset.listId;
	}
	render();
	save();
});

deleteList.addEventListener('click', () => {
	for (let i = 0; i < lists.length; i++) {
		if (lists[i].name.toLowerCase() === SelectedList.toLocaleLowerCase()) {
			lists.splice(i, 1);
		}
	}
	SelectedList = null;
	render();
	save();
});

newListForm.addEventListener('submit', (e) => {
	e.preventDefault();
	function invalidInput() {
		return (newListInput.value = null);
	}
	const listName = newListInput.value.trim();
	if (
		listName === null ||
		listName === '' ||
		listName === 'Enter something valid' ||
		listName === 'Name already exists'
	) {
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
	save();
});

function createList(name) {
	return { name: name, tasks: [] };
}

function save() {
	localStorage.setItem(LocalStorageList, JSON.stringify(lists));
	localStorage.setItem(LocalStorageActiveList, SelectedList);
}

function render() {
	listContainer.innerHTML = '';
	renderList();
	if (!SelectedList) {
		taskListDisplay.style.display = 'none';
	} else {
		taskListDisplay.style.display = 'block';
	}
}
function renderList() {
	lists.forEach((list) => {
		const listElement = document.createElement('li');
		listElement.dataset.listId = list.name;
		listElement.classList.add('list-name');
		listElement.innerText = list.name;
		if (!SelectedList) {
			SelectedList = lists[0].name;
		}
		if (list.name === SelectedList) {
			listElement.classList.add('active-list');
		}
		listContainer.append(listElement);
	});
}
render();
