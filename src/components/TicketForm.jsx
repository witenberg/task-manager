"use client"

import { useState, useEffect } from "react";

const TicketForm = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');

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

    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          taskId: selectedTask,
          title: selectedTaskTitle,
          description: ticketDescription,
        }),
      });

      if (response.ok) {
        setTicketDescription('');
        setSelectedTask('');
        setSelectedTaskTitle('');
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
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="task" className="block text-gray-700">
          Select Task
        </label>
        <select
          id="task"
          value={selectedTask}
          onChange={handleTaskChange} // Użyj nowej funkcji zmiany
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

      <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded">
        Create Ticket
      </button>
    </form>
  );
};

export default TicketForm;
