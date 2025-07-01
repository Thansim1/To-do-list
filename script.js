const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const repeatSelect = document.getElementById("repeat-select");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");

document.addEventListener("DOMContentLoaded", loadTasks);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const repeat = repeatSelect.value;
  if (taskText !== "") {
    addTask(taskText, priority, repeat);
    saveTask({ text: taskText, completed: false, priority, repeat });
    taskInput.value = "";
  }
});

function addTask(text, priority, repeat, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const top = document.createElement("div");
  top.className = "task-main";
  top.innerHTML = `<span>${text}</span>`;

  const buttons = document.createElement("span");
  const doneBtn = document.createElement("button");
  doneBtn.innerHTML = "✔️";
  doneBtn.title = "Complete";
  doneBtn.onclick = () => {
    li.classList.toggle("completed");
    updateStorage();
  };

  const delBtn = document.createElement("button");
  delBtn.innerHTML = "🗑️";
  delBtn.title = "Delete";
  delBtn.onclick = () => {
    li.remove();
    updateStorage();
  };

  buttons.appendChild(doneBtn);
  buttons.appendChild(delBtn);
  top.appendChild(buttons);

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.innerHTML = `
    <span class="priority-${priority.toLowerCase()}">Priority: ${priority}</span>
    <span>Repeat: ${repeat}</span>
  `;

  li.appendChild(top);
  li.appendChild(meta);
  taskList.appendChild(li);
  updateSummary();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateSummary();
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => {
    addTask(task.text, task.priority, task.repeat, task.completed);
  });
  updateSummary();
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const text = li.querySelector(".task-main span").textContent;
    const priority = li.querySelector(".task-meta span:nth-child(1)").textContent.split(": ")[1];
    const repeat = li.querySelector(".task-meta span:nth-child(2)").textContent.split(": ")[1];
    tasks.push({
      text,
      completed: li.classList.contains("completed"),
      priority,
      repeat
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateSummary();
}

function updateSummary() {
  const tasks = document.querySelectorAll("#task-list li");
  const completed = document.querySelectorAll("#task-list li.completed");
  totalCount.textContent = tasks.length;
  completedCount.textContent = completed.length;
}
