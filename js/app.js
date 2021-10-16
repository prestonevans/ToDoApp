const listContainer = document.querySelector('.task-list');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteList = document.querySelectorAll('.delete')[1];
const clearTask = document.querySelectorAll('.delete')[0];
const newTaskForm = document.querySelector('.new-task-creator form');
const newTaskInput = document.querySelector('.new-task-creator input');

const taskListDisplay = document.querySelector('.todo-list');
const title = document.querySelector('.list-title');
const count = document.querySelector('.task-count');
const tasks = document.querySelector('.todo-body');

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
tasks.addEventListener('click', (e) => {
	if (e.target.tagName.toLowerCase() === 'input') {
		const selected = lists.find((list) => list.name === SelectedList);
		const selectedTask = selected.tasks.find(
			(task) => task.name.toLowerCase() === e.target.nextElementSibling.innerText.toLowerCase()
		);
		selectedTask.complete = e.target.checked;
	}
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
clearTask.addEventListener('click', () => {
	const selected = lists.find((list) => list.name === SelectedList);
	const notDone = selected.tasks.filter((task) => task.complete === false);
	selected.tasks = notDone;
	render();
	save();
});
newListForm.addEventListener('submit', (e) => {
	e.preventDefault();
	function invalidInput() {
		return (newListInput.value = null);
	}
	const listName = newListInput.value.trim().toLowerCase();
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
		if (listName === list.name) {
			newListInput.value = 'Name already exists';
			setTimeout(invalidInput, 1000);
			return;
		}
	}
	const list = createList(listName);
	newListInput.value = null;
	lists.push(list);
	SelectedList = listName;
	render();
	save();
});

newTaskForm.addEventListener('submit', (e) => {
	e.preventDefault();
	function invalidInput() {
		return (newTaskInput.value = null);
	}
	const taskName = newTaskInput.value.trim().toLowerCase();
	if (
		taskName === null ||
		taskName === '' ||
		taskName === 'Enter something valid' ||
		taskName === 'Name already exists'
	) {
		newTaskInput.value = 'Enter something valid';
		setTimeout(invalidInput, 1000);
		return;
	}
	const selected = lists.find((list) => list.name === SelectedList);
	for (let task of selected.tasks) {
		if (taskName === task.name) {
			newTaskInput.value = 'Name already exists';
			setTimeout(invalidInput, 1000);
			return;
		}
	}
	const task = createTask(taskName);
	newTaskInput.value = null;
	for (let i = 0; i < lists.length; i++) {
		if (lists[i].name.toLowerCase() === SelectedList.toLocaleLowerCase()) {
			lists[i].tasks.push(task);
		}
	}
	render();
	save();
});
function createTask(name) {
	return { name: name, complete: false };
}
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
		for (let i = 0; i < lists.length; i++) {
			if (lists[i].name.toLowerCase() === SelectedList.toLocaleLowerCase()) {
				title.innerText = lists[i].name.toLowerCase();
				tasks.innerHTML = '';
				renderTasks(lists[i]);
			}
		}
	}
}
function renderTasks(taskList) {
	taskList.tasks.forEach((task, i) => {
		const div = document.createElement('div');
		const input = document.createElement('input');
		const label = document.createElement('label');
		const span = document.createElement('span');
		const body = document.querySelector('.todo-body');
		const button = document.createElement('button');

		div.classList.add('tasks');
		input.type = 'checkbox';
		input.id = `task-${i + 1}`;
		input.checked = task.complete;
		div.append(input);
		label.htmlFor = `task-${i + 1}`;
		span.classList.add('custom-checkbox');
		label.append(span);
		label.append(task.name);
		div.append(label);
		button.classList.add('btn');
		button.innerText = 'Delete';
		div.append(button);
		body.append(div);
	});
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
