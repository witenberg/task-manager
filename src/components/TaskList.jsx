"use client"

import { useState } from "react";
import Task from "./Task";
import dayjs from "dayjs";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask,
          description: newDescription, // Dodanie opisu
          completed: false,
          creationDate: dayjs().toISOString(),
        },
      ]);
      setNewTask("");
      setNewDescription(""); // Resetowanie pola opisu
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (id, newTitle, newDescription, newCompletionDate) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title: newTitle, description: newDescription, completionDate: newCompletionDate }
          : task
      )
    );
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h3>
      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Add a new task"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full mt-2"
          placeholder="Add a description"
        />
        <button
          onClick={handleAddTask}
          className="mt-2 p-2 bg-blue-600 text-white rounded-md"
        >
          Add Task
        </button>
      </div>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
          />
        ))
      ) : (
        <p className="text-gray-600">No tasks yet. Start by adding a new one!</p>
      )}
    </section>
  );
};

export default TaskList;
