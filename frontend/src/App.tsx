import { useState, useEffect } from 'react';

interface Tarea {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Tarea[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim() === "") {
      alert("Por favor ingrese una tarea.");
      return;
    }

    const newTodo: Tarea = {
      id: Date.now(),
      text: taskInput,
      completed: false
    };

    setTasks([...tasks, newTodo]);
    setTaskInput(""); // Limpiar input
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
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
          <li key={tarea.id}>
            <div className="added-task">
              <div className="description-container">
                <input type="checkbox" checked={tarea.completed} readOnly />
                <span>{tarea.text}</span> 
              </div>
              <div className="action-buttons">
                <button className="action-task edit">Edit</button>
                <button 
                  className="action-task delete" 
                  onClick={() => handleDeleteTask(tarea.id)}
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