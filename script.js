class TodoList {
    constructor() {
        this.todoList = document.getElementById('todo-list');
        this.notification = document.getElementById('notification'); 
        this.loadTasksFromLocalStorage();
    }

     // Function to show notifications
    showNotification(message) {
        this.notification.innerText = message;
        this.notification.classList.add('show');
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000); 
    }


    // Toggle task completion
    toggleTaskCompletion(taskElement) {
        taskElement.completed = !taskElement.completed;
        taskElement.tickIcon.src = taskElement.completed ? "./imgs/tick.png" : "./imgs/not_tick.png";
        taskElement.title.classList.toggle('completed', taskElement.completed);
        this.updateTaskCompletionInLocalStorage(taskElement.id, taskElement.completed);
    }


    // Edit task
    editTask(taskElement) {
        const updatedTask = prompt("Edit your task:", taskElement.title.innerText);
        if (updatedTask !== null && updatedTask !== '') {
            taskElement.title.innerText = updatedTask;
            this.updateTaskInLocalStorage(taskElement.id, updatedTask);
            this.showNotification("Task updated successfully!");
        }
    }

       // Delete task
    deleteTask(taskElement) {
        if (confirm("Are you sure you want to delete this task?")) {
            taskElement.element.remove();
            this.deleteTaskFromLocalStorage(taskElement.id);
            this.showNotification("Task deleted successfully!");
        }
    }

        // Create a new task element
    createTaskElement({ id, content, completed }) {
        const tickIconSrc = completed ? "./imgs/tick.png" : "./imgs/not_tick.png";

        const newMission = document.createElement('div');
        newMission.classList.add('mission');
        newMission.innerHTML = `
            <div class="todo">
                <img src="${tickIconSrc}" class="tik-img" alt="tick-icon">
                <h3>${content}</h3>
            </div>
            <div class="edit">
                <button>Edit</button>
                <img src="./imgs/delete.png" class="delete-img" alt="delete-icon">
            </div>
        `;
        this.todoList.appendChild(newMission);

        const taskElement = {
            element: newMission,
            tickIcon: newMission.querySelector('.tik-img'),
            title: newMission.querySelector('h3'),
            editButton: newMission.querySelector('.edit button'),
            deleteIcon: newMission.querySelector('.delete-img'),
            id,
            completed
        };

        taskElement.title.classList.toggle('completed', completed);

         // Add event listeners
        taskElement.tickIcon.addEventListener('click', () => {
            this.toggleTaskCompletion(taskElement);
        });
        taskElement.title.addEventListener('click', () => {
            this.toggleTaskCompletion(taskElement);
        });
        taskElement.editButton.addEventListener('click', () => this.editTask(taskElement));
        taskElement.deleteIcon.addEventListener('click', () => this.deleteTask(taskElement));

        return taskElement;
    }

  // Add new task
    addTask(taskContent) {
        if (taskContent === '') {
            this.showNotification("Task cannot be empty!");
            return;
        }
        const taskId = Date.now();
        this.createTaskElement({ id: taskId, content: taskContent, completed: false });
        this.saveTaskToLocalStorage(taskId, taskContent, false);
        this.showNotification("Task added successfully!");
    }

     // Save task to localStorage
    saveTaskToLocalStorage(id, content, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ id, content, completed });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }


    // Update task in localStorage
    updateTaskInLocalStorage(id, updatedContent) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, content: updatedContent } : task);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

 // Update task completion in localStorage
    updateTaskCompletionInLocalStorage(id, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, completed } : task);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }


    // Delete task from localStorage
    deleteTaskFromLocalStorage(id) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

// Load tasks from localStorage
    loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => this.createTaskElement(task));
    }
}

// Initialize the TodoList class and handle adding new tasks
const myInput = document.getElementById('input');
const addBtn = document.getElementById('add');
const todoList = new TodoList();

// Add new task event listener
addBtn.addEventListener('click', () => {
    let inputValue = myInput.value.trim();

    if (inputValue.length > 16) {
        alert("Task should be 16 characters max!");
        return;
    }

    todoList.addTask(inputValue);
    myInput.value = ''; 
});
