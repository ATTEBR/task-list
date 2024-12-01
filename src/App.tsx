import { useState, useEffect } from 'react'
import './App.css'

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
  category: string;
}

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Other'];

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    }
    return []
  })
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState(CATEGORIES[0])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (text: string, dueDate: string, category: string) => {
    if (text.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        dueDate,
        category
      }
      setTasks([...tasks, newTask])
      setNewTaskText('')
      setNewTaskDate('')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTask(newTaskText, newTaskDate, newTaskCategory)
  }

  return (
    <div className="container">
      <h1>Task List</h1>
      
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add task"
          className="task-input"
        />
        <input
          type="date"
          value={newTaskDate}
          onChange={(e) => setNewTaskDate(e.target.value)}
          className="date-input"
        />
        <select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          className="category-select"
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button type="submit" className="add-button">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <label className="task-label">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <div className="task-content">
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
                <div className="task-details">
                  <span className="task-category">{task.category}</span>
                  {task.dueDate && (
                    <span className="task-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
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
