import { useState, useEffect } from 'react';

interface Tarea {
  task_id: string;
  name: string;
  description: string;
  completed: boolean;
  priority: number;
}

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState<Tarea[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error al cargar tareas:", err));
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim() === "") {
      alert("Por favor ingrese una tarea.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: taskInput })
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        setTaskInput("");
      }
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task.task_id === id ? { ...task, completed: !currentStatus } : task
        ));
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.task_id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <main>
      <div className="add-box">
        <form onSubmit={handleAddTask}>
          <input 
            type="text" 
            id="inp-task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Nueva tarea..."
          />
          <button type="submit" id="add-task">Agregar</button>
        </form>
      </div>

      <ul id="tasks">
        {tasks.map(tarea => (
          <li key={tarea.task_id}>
            <div className="added-task">
              <div className="description-container">
                <input 
                  type="checkbox" 
                  checked={tarea.completed} 
                  onChange={() => handleToggleComplete(tarea.task_id, tarea.completed)} 
                />
                <span style={{ textDecoration: tarea.completed ? 'line-through' : 'none' }}>
                  {tarea.name}
                </span> 
              </div>
              <div className="action-buttons">
                <button className="action-task edit">Edit</button>
                <button 
                  className="action-task delete" 
                  onClick={() => handleDeleteTask(tarea.task_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;