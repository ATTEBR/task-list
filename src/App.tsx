import { useState, useEffect } from 'react'
import './App.css'

interface Task {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  dueDate: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
  color: string;
}

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'] as const;
const STATUSES = ['Not Started', 'In Progress', 'Completed'] as const;
const COLORS = ['#ffffff', '#ffebee', '#e8f5e9', '#e3f2fd', '#fff3e0'];

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    }
    return []
  })
  
  // Form states
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState(CATEGORIES[0])
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('Medium')
  const [newTaskColor, setNewTaskColor] = useState(COLORS[0])
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'category'>('dueDate')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (
    text: string,
    description: string,
    dueDate: string,
    category: string,
    priority: Task['priority'],
    color: string
  ) => {
    if (text.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: text.trim(),
        description: description.trim(),
        completed: false,
        dueDate,
        category,
        priority,
        status: 'Not Started',
        color
      }
      setTasks([...tasks, newTask])
      // Reset form
      setNewTaskText('')
      setNewTaskDescription('')
      setNewTaskDate('')
      setNewTaskPriority('Medium')
      setNewTaskColor(COLORS[0])
    }
  }

  const updateTaskStatus = (id: number, status: Task['status']) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, status, completed: status === 'Completed' } : task
    ))
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTask(
      newTaskText,
      newTaskDescription,
      newTaskDate,
      newTaskCategory,
      newTaskPriority,
      newTaskColor
    )
  }

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'All' || task.category === filterCategory
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority
      return matchesSearch && matchesCategory && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          return PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority)
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  return (
    <div className="container">
      <h1>Task List</h1>
      
      {/* Search and Filter Controls */}
      <div className="controls">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Priorities</option>
          {PRIORITIES.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'category')}
          className="filter-select"
        >
          <option value="dueDate">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Task title"
            className="task-input"
            required
          />
          <input
            type="date"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            className="date-input"
            required
          />
        </div>
        <div className="form-row">
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task description (optional)"
            className="description-input"
          />
        </div>
        <div className="form-row">
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            className="category-select"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
            className="priority-select"
          >
            {PRIORITIES.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <input
            type="color"
            value={newTaskColor}
            onChange={(e) => setNewTaskColor(e.target.value)}
            className="color-input"
            title="Choose label color"
          />
          <button type="submit" className="add-button">Add Task</button>
        </div>
      </form>

      {/* Task List */}
      <ul className="task-list">
        {filteredAndSortedTasks.map((task) => (
          <li 
            key={task.id} 
            className="task-item"
            style={{ backgroundColor: task.color }}
          >
            <div className="task-content">
              <div className="task-header">
                <h3 className="task-title">{task.text}</h3>
                <div className="task-badges">
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className="category-badge">
                    {task.category}
                  </span>
                </div>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              <div className="task-footer">
                <div className="task-metadata">
                  {task.dueDate && (
                    <span className="task-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                    className="status-select"
                  >
                    {STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
