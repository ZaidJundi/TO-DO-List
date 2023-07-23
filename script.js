document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const tasksList = document.getElementById("tasksList");
    let taskCounter = 1; 

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const taskTitle = document.getElementById("taskTitle").value;
        const taskDescription = document.getElementById("taskDescription").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        const task = { id: taskCounter, title: taskTitle, description: taskDescription, start: startDate, end: endDate };
        addTaskToList(task);
        saveTaskToLocalStorage(task);

        taskForm.reset();
        taskCounter++; 
    });

    function addTaskToList(task) {
        
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        const status = getTaskStatus(task.start, task.end);
        taskElement.innerHTML = `
            <h3>Task #${task.id}</h3>
            <p>${task.title}</p>
            <p>${task.description}</p>
            <p><strong>Start Date:</strong> ${task.start}</p>
            <p><strong>End Date:</strong> ${task.end}</p>
            <p><strong>Status:</strong> ${status}</p>
            <button data-id="${task.id}" class="delete-btn">Delete</button>
        `;
        tasksList.appendChild(taskElement);
    }
    
    function getTaskStatus(startDate, endDate) {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        if (today >= start && today <= end) {
            return "In progress";
        } else if (today < start) {
            const daysLeft = Math.floor((start - today) / (1000 * 60 * 60 * 24));
            return `${daysLeft+1} days left`;
        } else if (today > end) {
            return "Completed";
        }
    }
    
    function saveTaskToLocalStorage(task) {
        let todolist = JSON.parse(localStorage.getItem("todolist")) || [];
        todolist.push(task);
        localStorage.setItem("todolist", JSON.stringify(todolist));
    }

    function removeTask(id) {
        let todolist = JSON.parse(localStorage.getItem("todolist"));
        todolist = todolist.filter((task) => task.id !== id);
        localStorage.setItem("todolist", JSON.stringify(todolist));

        tasksList.innerHTML = "";
        todolist.forEach(addTaskToList);
    }

    tasksList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const id = parseInt(event.target.dataset.id, 10);
            removeTask(id);
        }
    });

    let todolist = JSON.parse(localStorage.getItem("todolist")) || [];
    todolist.forEach(addTaskToList);
});