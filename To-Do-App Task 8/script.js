const userInput = document.getElementById("userInput");
const addUserBtn = document.getElementById("addUserBtn");
const userSelect = document.getElementById("userSelect");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

let users = JSON.parse(localStorage.getItem("users")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderUsers() {
    userSelect.innerHTML = `<option value="">Select User</option>`;

    users.forEach(function (user) {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
    });
}

function addUser() {
    const name = userInput.value.trim();

    if (name === "") {
        alert("Please enter a user name.");
        return;
    }

    const namePattern = /^[A-Za-z][A-Za-z0-9]*$/;

    if (!namePattern.test(name)) {
        alert("User name must start with a letter and can only contain letters and numbers.");
        return;
    }

    const userExists = users.some(function (user) {
        return user.name.toLowerCase() === name.toLowerCase();
    });

    if (userExists) {
        alert("User already exists.");
        return;
    }

    const user = {
        id: Date.now() + Math.random(),
        name: name
    };

    users.push(user);

    saveData();
    renderUsers();

    userInput.value = "";
}

function addTask() {
    const text = taskInput.value.trim();
    const userId = userSelect.value;

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    if (userId === "") {
        alert("Please select a user.");
        return;
    }

    const taskExists = tasks.some(function (task) {
        return (
            task.userId === Number(userId) &&
            task.text.toLowerCase() === text.toLowerCase()
        );
    });

    if (taskExists) {
        alert("This task already exists for the selected user.");
        return;
    }

    const task = {
        id: Date.now() + Math.random(),
        userId: Number(userId),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveData();
    renderTasks();
    updateStats();

    taskInput.value = "";
}

function renderTasks() {
    taskList.innerHTML = "";

    const selectedUser = Number(userSelect.value);

    if (!selectedUser) {
        return;
    }

    const userTasks = tasks.filter(function (task) {
        return task.userId === selectedUser;
    });

    userTasks.forEach(function (task) {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        // Left section (checkbox + text)
        const leftDiv = document.createElement("div");
        leftDiv.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(span);

        // Right section (buttons)
        const buttonDiv = document.createElement("div");
        buttonDiv.style.display = "flex";
        buttonDiv.style.gap = "5px";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "editBtn";

        editButton.addEventListener("click", function () {
            editTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteBtn";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);

        // Append both sections to the task container
        taskDiv.appendChild(leftDiv);
        taskDiv.appendChild(buttonDiv);

        taskList.appendChild(taskDiv);
    });
}

function toggleTask(id) {
    tasks.forEach(function (task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }
    });

    saveData();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveData();
    renderTasks();
    updateStats();
}

function editTask(id) {
    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const newTask = prompt("Edit Task:", task.text);

    if (newTask === null) {
        return;
    }

    const updatedTask = newTask.trim();

    if (updatedTask === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = updatedTask;

    saveData();
    renderTasks();
    updateStats();
}

function updateStats() {
    const selectedUser = Number(userSelect.value);

    if (!selectedUser) {
        completedCount.textContent = 0;
        pendingCount.textContent = 0;
        return;
    }

    const userTasks = tasks.filter(function (task) {
        return task.userId === selectedUser;
    });

    const completedTasks = userTasks.filter(function (task) {
        return task.completed;
    });

    const pendingTasks = userTasks.filter(function (task) {
        return !task.completed;
    });

    completedCount.textContent = completedTasks.length;
    pendingCount.textContent = pendingTasks.length;
}

// Event Listeners
addUserBtn.addEventListener("click", function () {
    addUser();
});

addTaskBtn.addEventListener("click", function () {
    addTask();
});

userSelect.addEventListener("change", function () {
    renderTasks();
    updateStats();
});

// Initial Render
renderUsers();
renderTasks();
updateStats();