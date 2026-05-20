const but = document.getElementById("add-task");
const taskInput = document.getElementById("inp-task");
const din = document.getElementById("tasks");

but.addEventListener("click", addTarea);

document.addEventListener("DOMContentLoaded", cargarTareas);

function cargarTareas() {
    const todolist = JSON.parse(localStorage.getItem("tasks")) || [];
    din.innerHTML = "";

    todolist.forEach(tarea => {
        const item = `
            <li>
                <div class="added-task">
                    <div class="description-container">
                        <input type="checkbox">
                        <span>${tarea}</span> 
                    </div>
                    <div class="action-buttons">
                        <button class="action-task edit">Edit</button>
                        <button class="action-task delete">Delete</button>
                    </div>
                </div>
            </li>`;
        din.innerHTML += item;
    });
}

function addTarea(e) {
    e.preventDefault(); 

    if (taskInput.value.trim() !== "") {
        let todolist = JSON.parse(localStorage.getItem("tasks")) || [];
        
        todolist.push(taskInput.value);

        localStorage.setItem("tasks", JSON.stringify(todolist));
        
        cargarTareas();
        
        taskInput.value = "";
    } else {
        alert("Por favor ingrese una tarea.");
    }
}