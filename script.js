// === Task Logic ===
function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskDate = document.getElementById("task-date").value;
  const priority = document.getElementById("task-priority").value;
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const taskList = document.getElementById("task-list");
  const listItem = document.createElement("li");

  listItem.innerHTML = `
    <span onclick="toggleComplete(this)" class="${priority}-priority">${taskText} - Due: ${taskDate}</span>
    <button class="edit-btn" onclick="editTask(this)">Edit</button>
    <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
  `;

  taskList.appendChild(listItem);
  taskInput.value = "";
  saveTasks();
}

function deleteTask(button) {
  button.parentElement.remove();
  saveTasks();
}

function editTask(button) {
  const span = button.parentElement.querySelector("span");
  const newText = prompt("Edit task:", span.textContent.split(" - Due:")[0]);
  if (newText) {
    const due = span.textContent.split(" - Due:")[1];
    span.textContent = `${newText} - Due: ${due}`;
  }
  saveTasks();
}

function toggleComplete(span) {
  span.classList.toggle("completed");
  saveTasks();
}

function filterUpcoming() {
  document.querySelectorAll("#task-list li").forEach(task => {
    const span = task.querySelector("span");
    task.style.display = span.classList.contains("completed") ? "none" : "flex";
  });
}

function filterCompleted() {
  document.querySelectorAll("#task-list li").forEach(task => {
    const span = task.querySelector("span");
    task.style.display = span.classList.contains("completed") ? "flex" : "none";
  });
}

// === Storage ===
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(item => {
    const span = item.querySelector("span");
    tasks.push({
      text: span.textContent,
      completed: span.classList.contains("completed"),
      priority: span.classList[0].replace("-priority", "")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("task-list");

  savedTasks.forEach(task => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span onclick="toggleComplete(this)" class="${task.priority}-priority ${task.completed ? 'completed' : ''}">${task.text}</span>
      <button class="edit-btn" onclick="editTask(this)">Edit</button>
      <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
    `;
    taskList.appendChild(listItem);
  });
}

// === Language Toggle with Persistence ===
function applyLanguage(lang) {
  const labels = {
    en: ["Enter task", "Low Priority", "Medium Priority", "High Priority", "Add Task", "Show Upcoming", "Show Completed"],
    fr: ["Entrer une tâche", "Priorité basse", "Priorité moyenne", "Priorité haute", "Ajouter tâche", "À venir", "Terminées"]
  };

  document.body.dataset.lang = lang;
  localStorage.setItem("lang", lang);

  document.getElementById("task-input").placeholder = labels[lang][0];
  const options = document.querySelectorAll("#task-priority option");
  options.forEach((el, i) => (el.textContent = labels[lang][i + 1]));
  const buttons = document.querySelectorAll("#add-task, #show-upcoming, #show-completed");
  buttons.forEach((btn, i) => (btn.textContent = labels[lang][i + 4]));
  document.getElementById("lang-toggle").textContent = lang === "en" ? "FR 🇫🇷" : "EN 🇺🇸";
}

// === Initialization ===
window.addEventListener("DOMContentLoaded", () => {
  // Restore saved language
  const savedLang = localStorage.getItem("lang") || "en";
  applyLanguage(savedLang);

  // Language toggle listener
  document.getElementById("lang-toggle").addEventListener("click", () => {
    const currentLang = document.body.dataset.lang;
    const nextLang = currentLang === "en" ? "fr" : "en";
    applyLanguage(nextLang);
  });

  // Load tasks after setting language
  loadTasks();

  // Task interactions
  document.getElementById("add-task").addEventListener("click", addTask);
  document.getElementById("show-upcoming").addEventListener("click", filterUpcoming);
  document.getElementById("show-completed").addEventListener("click", filterCompleted);
});
