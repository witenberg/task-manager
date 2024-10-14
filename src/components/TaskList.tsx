'use client'

import { useState, useEffect } from "react"
import Task from "./Task"
import { Plus, Filter, SortAsc } from "lucide-react"

interface TaskData {
  _id: string
  title: string
  description?: string
  completed: boolean
  creationDate: string
  completionDate?: string
}

export default function TaskList({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [newTask, setNewTask] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newCompletionDate, setNewCompletionDate] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("creationDate")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/home?userId=${userId}`)
        if (response.ok) {
          const tasksData = await response.json()
          setTasks(tasksData)
        } else {
          console.error('Failed to fetch tasks')
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    if (userId) {
      fetchTasks()
    }
  }, [userId])

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filterStatus === "completed") return task.completed
      if (filterStatus === "incomplete") return !task.completed
      return true
    })
    .sort((a, b) => {
      if (sortBy === "completionDate") {
        return new Date(a.completionDate || '').getTime() - new Date(b.completionDate || '').getTime()
      }
      return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
    })

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const taskData = {
        title: newTask,
        description: newDescription,
        completed: false,
        completionDate: newCompletionDate,
        userId: userId,
      }

      const response = await fetch('/api/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const createdTask = await response.json()
        setTasks([...tasks, createdTask])
        setNewTask("")
        setNewDescription("")
        setNewCompletionDate("")
      } else {
        console.error('Failed to create task')
      }
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/home?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== id))
      } else {
        console.error('Failed to delete task', await response.text())
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleToggleComplete = async (id: string) => {
    const taskToToggle = tasks.find(task => task._id === id)
    
    if (!taskToToggle) return

    const updatedCompletedStatus = !taskToToggle.completed
    const updatedCompletionDate = updatedCompletedStatus 
      ? (taskToToggle.completionDate || new Date().toISOString())
      : taskToToggle.completionDate

    try {
      const response = await fetch(`/api/home?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: taskToToggle.title,
          description: taskToToggle.description,
          completionDate: updatedCompletionDate,
          completed: updatedCompletedStatus,
        }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task =>
          task._id === id ? updatedTask : task
        ))
      } else {
        console.error('Failed to toggle task completion', await response.text())
      }
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  const handleEditTask = async (id: string, newTitle: string, newDescription: string, newCompletionDate: string) => {
    try {
      const response = await fetch(`/api/home?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: newTitle,
          description: newDescription,
          completionDate: newCompletionDate || tasks.find(task => task._id === id)?.completionDate,
          completed: tasks.find(task => task._id === id)?.completed,
        }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task =>
          task._id === id ? updatedTask : task
        ))
      } else {
        console.error('Failed to update task', await response.text())
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <section className="bg-white p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Task</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task Title"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task Description"
          />
          <input
            type="date"
            value={newCompletionDate}
            onChange={(e) => setNewCompletionDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddTask}
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" /> Add Task
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select 
              id="filterStatus" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <SortAsc size={20} className="text-gray-500" />
            <select 
              id="sortBy" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="creationDate">Creation Date</option>
              <option value="completionDate">Completion Date</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedTasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">No tasks yet. Start by adding a new one!</p>
      )}
    </section>
  )
}