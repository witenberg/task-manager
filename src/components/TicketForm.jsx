"use client";

import { useState, useEffect } from "react";

const TicketForm = ({ userId, refreshTickets }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/home?userId=${userId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, [userId]);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('category', selectedCategory);
    formData.append('title', ticketTitle);
    formData.append('taskId', selectedTask);
    formData.append('description', ticketDescription);
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTicketDescription('');
        setTicketTitle('');
        setSelectedTask('');
        setScreenshot(null);
        setSelectedCategory('');
        setSuccessMessage('Ticket został pomyślnie utworzony!');

        // Wywołaj `refreshTickets` po pomyślnym dodaniu nowego ticketa
        if (refreshTickets) {
          refreshTickets();
        }
      } else {
        console.error("Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  }
  
  function handleTaskChange(e) {
    const taskId = e.target.value;
    const task = tasks.find(task => task._id === taskId);
    setSelectedTask(taskId);
    setSelectedTaskTitle(task ? task.title : '');
  }

  return (
    <div>
      {successMessage && (
        <div className="mb-4 text-green-500">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700">
          Select Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border"
        >
          <option value="" disabled>Select a category</option>
          <option value="task">Problem with Task</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature Request</option>
          <option value="other">Other</option>
        </select>
      </div>

      {selectedCategory && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700">
              Ticket Title
            </label>
            <input
              id="title"
              type="text"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              className="w-full px-3 py-2 border"
              required
            />
          </div>

          {selectedCategory === 'task' && (
            <div className="mb-4">
              <label htmlFor="task" className="block text-gray-700">
                Select Task
              </label>
              <select
                id="task"
                value={selectedTask}
                onChange={handleTaskChange}
                className="w-full px-3 py-2 border"
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

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">
              Ticket Description
            </label>
            <textarea
              id="description"
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              className="w-full px-3 py-2 border"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="screenshot" className="block text-gray-700">
              Upload Screenshot (optional)
            </label>
            <input
              type="file"
              id="screenshot"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
            />
          </div>

          <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded">
            Create Ticket
          </button>
        </form>
      )}
    </div>
  );
};

export default TicketForm;
