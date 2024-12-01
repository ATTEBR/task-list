import { useState, useEffect } from 'react'
import './App.css'

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (text: string) => {
    if (text.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
      }
      setTasks([...tasks, newTask])
    }
  }

  const toggleComplete = (id: number) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="container">
      <h1>Task List</h1>
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Add task" 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTask((e.target as HTMLInputElement).value)
              ;(e.target as HTMLInputElement).value = ''
            }
          }} 
        />
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <label className="task-label">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
            </label>
            <button 
              onClick={() => removeTask(task.id)}
              className="remove-button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
