'use client'

import { useState, useEffect } from "react"
import { AlertCircle, Send } from "lucide-react"

interface Task {
  _id: string
  title: string
}

interface TicketFormProps {
  userId: string
  refreshTickets: () => void
}

const TicketForm: React.FC<TicketFormProps> = ({ userId, refreshTickets }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTask, setSelectedTask] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketTitle, setTicketTitle] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/home?userId=${userId}`)
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }

    fetchTasks()
  }, [userId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('category', selectedCategory)
    formData.append('title', ticketTitle)
    formData.append('taskId', selectedTask)
    formData.append('description', ticketDescription)
    if (screenshot) {
      formData.append('screenshot', screenshot)
    }

    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setTicketDescription('')
        setTicketTitle('')
        setSelectedTask('')
        setScreenshot(null)
        setSelectedCategory('')
        setSuccessMessage('Ticket has been successfully created!')

        if (refreshTickets) {
          refreshTickets()
        }
      } else {
        console.error("Failed to create ticket")
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
    }
  }

  return (
    <div>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
          <AlertCircle className="mr-2" />
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Select Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>Select a category</option>
          <option value="task">Problem with Task</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature Request</option>
          <option value="other">Other</option>
        </select>
      </div>

      {selectedCategory && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Title
            </label>
            <input
              id="title"
              type="text"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {selectedCategory === 'task' && (
            <div>
              <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                Select Task
              </label>
              <select
                id="task"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a task</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Description
            </label>
            <textarea
              id="description"
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Screenshot (optional)
            </label>
            <input
              type="file"
              id="screenshot"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files ? e.target.files[0] : null)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          >
            <Send className="mr-2" size={20} />
            Create Ticket
          </button>
        </form>
      )}
    </div>
  )
}

export default TicketForm