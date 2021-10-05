const listContainer = document.querySelector('.task-list');

let lists = ['name', 'todo'];

function render() {
    listContainer.innerHTML = '';
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.classList.add('list-name');
        listElement.innerText = list;
        listContainer.append(listElement);
    });
};
render();
