document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("add-task").addEventListener("click", addTask);
document.getElementById("show-upcoming").addEventListener("click", filterUpcoming);
document.getElementById("show-completed").addEventListener("click", filterCompleted);

function addTask() {
    let taskInput = document.getElementById("task-input");
    let taskDate = document.getElementById("task-date").value;
    let priority = document.getElementById("task-priority").value;
    let taskText = taskInput.value.trim();

    if (taskText === "") return;

    let taskList = document.getElementById("task-list");
    let listItem = document.createElement("li");

    listItem.innerHTML = `
        <span onclick="toggleComplete(this)" class="${priority}-priority">${taskText} - Due: ${taskDate}</span>
        <button class="edit-btn" onclick="editTask(this)">Edit</button>
        <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
    `;

    taskList.appendChild(listItem);
    saveTasks();
    taskInput.value = "";
}

function deleteTask(task) {
    task.parentElement.remove();
    saveTasks();
}

function editTask(task) {
    let taskText = task.parentElement.querySelector("span");
    let newText = prompt("Edit task:", taskText.textContent.split(" - Due:")[0]);
    if (newText) taskText.textContent = newText + " - Due: " + taskText.textContent.split(" - Due:")[1];
    saveTasks();
}

function toggleComplete(task) {
    task.classList.toggle("completed");
    saveTasks();
}

function filterUpcoming() {
    document.querySelectorAll("#task-list li").forEach(task => {
        task.style.display = task.querySelector("span").classList.contains("completed") ? "none" : "flex";
    });
}

function filterCompleted() {
    document.querySelectorAll("#task-list li").forEach(task => {
        task.style.display = task.querySelector("span").classList.contains("completed") ? "flex" : "none";
    });
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#task-list li").forEach(item => {
        tasks.push({ 
            text: item.querySelector("span").textContent, 
            completed: item.querySelector("span").classList.contains("completed"),
            priority: item.querySelector("span").classList[0]
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("task-list");

    savedTasks.forEach(task => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <span onclick="toggleComplete(this)" class="${task.priority} ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
        `;
        taskList.appendChild(listItem);
    });
}
