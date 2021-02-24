const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.querySelector('.todos-wrapper');

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));

let todoItemElems = [];
let activeTasks = [];
let completedTasks = [];

let lowerPrior = [];

function Task(description, getPrior){
	this.description = description;
	this.completed = false;
	this.prior = getPrior;
}

const createTemplate = (task, index) => {
	return `
		<li class="todo-item ${task.completed ? 'checked' : ''}">
			<div class="description">${task.description}</div>
			<div class="buttons">
				<input onclick="completeTask(${index})" class="btn-complete" type="checkbox" ${task.completed ? 'checked' : ''}>
				<button onclick="deleteTask(${index})" class="btn-delete">delete</button>
			</div>
		</li>
	`
}

const filterTasks = () => {
	activeTasks = tasks.length && tasks.filter(item => item.completed == false);
	completedTasks = tasks.length && tasks.filter(item => item.completed == true);
	tasks = [...activeTasks, ...completedTasks];
}

const filterLowerPrior = (tasks) => {
	lowerPrior = tasks;
	lowerPrior.sort((a, b) => a.prior > b.prior ? 1 : -1);
}

const fillHtmlList = () => {
	todosWrapper.innerHTML = "";
	if(tasks.length > 0) {
		filterTasks();
		tasks.forEach((item, index) => { 
			todosWrapper.innerHTML += createTemplate(item, index);	
		})
		todoItemElems = document.querySelectorAll('.todo-item');
	}
}

fillHtmlList();

const updateLocal = () => {
	localStorage.setItem('tasks', JSON.stringify(tasks));
} 

const completeTask = (index) => {
	tasks[index].completed = !tasks[index].completed;
	if(tasks[index].completed) {
		todoItemElems[index].classList.add('checked');	
	} else {
		todoItemElems[index].classList.remove('checked');
	}
	updateLocal();
	fillHtmlList();
}

const deleteTask = (index) =>{
	tasks.splice(index, 1);
	updateLocal();
	fillHtmlList();
} 

addTaskBtn.addEventListener('click', addNewTask = () => {
	if(deskTaskInput.value == ''){
		alert('Enter data, please')
	} else {
		let getPrior = prompt('Enter priority from 1 to 10 for this task');
		console.log(typeof (getPrior));
		while(getPrior < 1 || getPrior != getPrior*1 || getPrior > 10) {
			getPrior = prompt('Enter priority from 1 to 10 for this task');
			console.log(typeof (getPrior));
		}
		getPrior = Number(getPrior);
		console.log(typeof (getPrior));
		tasks.unshift(new Task(deskTaskInput.value.toLowerCase(), getPrior));
		updateLocal();
		fillHtmlList();
		deskTaskInput.value = ''; 
	}
})

deskTaskInput.addEventListener('keydown', (e) => {
	if(e.keyCode === 13){
		addNewTask();
	}
} )

document.getElementById('search-todo').oninput = function(){
	let val = this.value.toLowerCase().trim();
	let searchTodoItem = document.querySelectorAll('.todos-wrapper .description');
	if (val != '') {
		searchTodoItem.forEach( (elem) => {
			console.log(elem);
			if (elem.innerText.search(val) == -1){
				elem.parentNode.classList.add('hide');
			} else {
				elem.parentNode.classList.remove('hide');
			}
		});
	} else {
		searchTodoItem.forEach( (elem) => {
			elem.parentNode.classList.remove('hide');	
	});
 }
}

document.getElementById('all-btn').addEventListener('click', () => {
	fillHtmlList();
});
document.getElementById('done-btn').addEventListener('click', () => {
	filterTasks();
	todosWrapper.innerHTML = "";
	if(completedTasks.length > 0) {
		completedTasks.forEach((item, index) => {
			todosWrapper.innerHTML += createTemplate(item, index);	
		})
		todoItemElems = document.querySelectorAll('.todo-item');
	}
});
document.getElementById('undone-btn').addEventListener('click', () => {
	filterTasks();
	todosWrapper.innerHTML = "";
	if(activeTasks.length > 0) {
		activeTasks.forEach((item, index) => {
			todosWrapper.innerHTML += createTemplate(item, index);	
		})
		todoItemElems = document.querySelectorAll('.todo-item');
	}
});

document.getElementById('lower-prior').addEventListener('click', () => {
	filterLowerPrior(tasks);
	todosWrapper.innerHTML = "";
	if(lowerPrior.length > 0) {
		lowerPrior.forEach((item, index) => {
			todosWrapper.innerHTML += createTemplate(item, index);	
		})
		todoItemElems = document.querySelectorAll('.todo-item');
	}
});
document.getElementById('hight-prior').addEventListener('click', () => {
	filterLowerPrior(tasks);
	lowerPrior.reverse();
	console.log(lowerPrior);
	todosWrapper.innerHTML = "";
	if(lowerPrior.length > 0) {
		lowerPrior.forEach((item, index) => {
			todosWrapper.innerHTML += createTemplate(item, index);	
		})
		todoItemElems = document.querySelectorAll('.todo-item');
	}
});
