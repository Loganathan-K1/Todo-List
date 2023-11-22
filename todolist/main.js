const addedTasks = new Set();
const missedTasks = new Set();

function addTask(taskId) {
  const container = document.getElementById('todo-container');

  // Details
  const taskName = document.getElementById(`${taskId}-name`).value;
  const taskCategory = document.getElementById(`${taskId}-category`).value;
  const taskDeadline = document.getElementById(`${taskId}-deadline`).value;
  const taskPriority = document.getElementById(`${taskId}-priority`).value;
  const taskLabel = document.getElementById(`${taskId}-label`).value;

  // Check Tasks the already exists
  const taskKey = `${taskName}_${taskCategory}_${taskDeadline}_${taskPriority}_${taskLabel}`;
  if (addedTasks.has(taskKey)) {
    alert('Task with the same details already exists!');
    return;
  }

  // Creating a new task
  const newTask = document.createElement('div');
  newTask.className = 'task';
  newTask.id = `task${container.childElementCount + 1}`;

  // Task Name
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Task Name:';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = taskName;
  nameInput.readOnly = true;

  // Remove Button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove Task';
  removeButton.onclick = () => removeTask(newTask.id);

  // View Button
  const viewButton = document.createElement('button');
  viewButton.textContent = 'View Task';
  viewButton.className = 'view-button';
  viewButton.onclick = () => viewTask(newTask.id);

  // Append elements to the new task div
  newTask.appendChild(nameLabel);
  newTask.appendChild(nameInput);
  newTask.appendChild(removeButton);
  newTask.appendChild(viewButton);

  // Append the new task div to the container
  container.insertBefore(newTask, container.lastElementChild);

  // Add task key to the set
  addedTasks.add(taskKey);

  // Check if the task is overdue
  checkOverdue(taskName, taskDeadline);
}

function removeTask(taskId) {
  const task = document.getElementById(taskId);
  task.parentNode.removeChild(task);

  // Remove task key from the set
  const taskDetails = task.querySelectorAll('input[type="text"], input[type="date"]');
  const taskKey = Array.from(taskDetails).map(input => input.value).join('_');
  addedTasks.delete(taskKey);

  // Remove task from missed tasks
  missedTasks.delete(taskName);

  // Update missed tasks container
  updateMissedTasksContainer();
}

function viewTask(taskId) {
  const task = document.getElementById(taskId);
  const taskDetails = task.querySelectorAll('input[type="text"], input[type="date"]');
  const detailsArray = Array.from(taskDetails).map(input => `${input.previousSibling.textContent} ${input.value}`);
  alert(detailsArray.join('\n'));
}

function checkOverdue(taskName, taskDeadline) {
  const currentDate = new Date();
  const deadlineDate = new Date(taskDeadline);

  if (deadlineDate < currentDate) {
    // Add task to missed tasks
    missedTasks.add(taskName);

    // Update missed tasks container
    updateMissedTasksContainer();
  }
}

function updateMissedTasksContainer() {
  const missedTasksContainer = document.getElementById('missed-tasks');
  missedTasksContainer.innerHTML = '';

  if (missedTasks.size > 0) {
    missedTasks.forEach(taskName => {
      const missedTaskElement = document.createElement('div');
      missedTaskElement.textContent = `Missed Task: ${taskName}`;
      missedTaskElement.className = 'missed-task';
      missedTasksContainer.appendChild(missedTaskElement);
    });
  } else {
    missedTasksContainer.textContent = 'No missed tasks.';
  }
}