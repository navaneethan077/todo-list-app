// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeLabel = document.querySelector('label[for="darkModeToggle"]');
const fab = document.getElementById('fab');

// Add Task Functionality
addTaskButton.addEventListener('click', () => {
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.innerHTML = `
      <span>${taskText}</span>
      <div>
        <button class="btn btn-success btn-sm complete-task">✓</button>
        <button class="btn btn-danger btn-sm delete-task">✗</button>
      </div>
    `;
    taskList.appendChild(listItem);

    // Clear input and refocus
    taskInput.value = '';
    taskInput.focus();

    saveTasks();
    autoScrollToBottom();
  }
});

// FAB for Adding Task
fab.addEventListener('click', () => {
  addTaskButton.click();
});

// Auto-scroll to the bottom of the task list
function autoScrollToBottom() {
  taskList.scrollTop = taskList.scrollHeight;
}

// Mark Task as Completed
taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('complete-task')) {
    const task = e.target.parentElement.previousElementSibling;
    task.classList.toggle('completed');
    saveTasks();
  }
});

// Delete Task
taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-task')) {
    const taskItem = e.target.closest('li');
    taskItem.remove();
    saveTasks();
  }
});

// Save Tasks to Local Storage
function saveTasks() {
  const tasks = Array.from(taskList.children).map(task => ({
    text: task.querySelector('span').innerText,
    completed: task.querySelector('span').classList.contains('completed')
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks) {
    tasks.forEach(taskData => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      const taskText = document.createElement('span');
      taskText.textContent = taskData.text;
      if (taskData.completed) {
        taskText.classList.add('completed');
      }
      listItem.appendChild(taskText);

      const buttons = document.createElement('div');
      buttons.innerHTML = `
        <button class="btn btn-success btn-sm complete-task">✓</button>
        <button class="btn btn-danger btn-sm delete-task">✗</button>
      `;
      listItem.appendChild(buttons);

      taskList.appendChild(listItem);
    });
  }
}

// Dark Mode Toggle
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  
  // Update the button text based on Dark Mode state
  if (document.body.classList.contains('dark-mode')) {
    darkModeLabel.textContent = 'Dark Mode Off'; // Dark mode is enabled
  } else {
    darkModeLabel.textContent = 'Light Mode'; // Dark mode is disabled
  }
});

// Load Dark Mode Preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
  darkModeLabel.textContent = 'Dark Mode Off'; // Set button text when dark mode is loaded
} else {
  darkModeLabel.textContent = 'Light Mode'; // Set button text when light mode is the default
}

// Load saved tasks on page load
window.onload = loadTasks;
