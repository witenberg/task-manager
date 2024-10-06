"use client";

import { useState, useEffect } from "react";
import Task from "./Task";

const TaskList = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCompletionDate, setNewCompletionDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("creationDate");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/home?userId=${userId}`);
                if (response.ok) {
                    const tasksData = await response.json();
                    setTasks(tasksData);
                } else {
                    console.error('Failed to fetch tasks');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        if (userId) {
            fetchTasks();
        }
    }, [userId]);


    const filteredAndSortedTasks = tasks
        .filter(task => {
            if (filterStatus === "completed") return task.completed;
            if (filterStatus === "incomplete") return !task.completed;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "completionDate") {
                return new Date(a.completionDate) - new Date(b.completionDate);
            }
            return new Date(a.creationDate) - new Date(b.creationDate);
        });


    const handleAddTask = async () => {
        if (newTask.trim()) {
            const taskData = {
                title: newTask,
                description: newDescription,
                completed: false,
                completionDate: newCompletionDate,
                userId: userId,
            };
    
            const response = await fetch('/api/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
    
            if (response.ok) {
                const createdTask = await response.json();
                setTasks([...tasks, createdTask]);
            } else {
                console.error('Failed to create task');
            }
    
            setNewTask("");
            setNewDescription("");
            setNewCompletionDate("");
        }
    };

    const handleDeleteTask = async (id) => {
    try {
        const response = await fetch(`/api/home?id=${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setTasks(tasks.filter(task => task._id !== id));
        } else {
            console.error('Failed to delete task', await response.text());
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

const handleToggleComplete = async (id) => {
    console.log('Toggling completion for task with id:', id);
    const taskToToggle = tasks.find(task => task._id === id);
    
    if (!taskToToggle) return;

    const updatedCompletedStatus = !taskToToggle.completed;
    const updatedCompletionDate = updatedCompletedStatus 
        ? (taskToToggle.completionDate || new Date().toISOString())
        : taskToToggle.completionDate;

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
        });

        if (response.ok) {
            const updatedTask = await response.json();
            setTasks(tasks.map(task =>
                task._id === id ? updatedTask : task
            ));
        } else {
            console.error('Failed to toggle task completion', await response.text());
        }
    } catch (error) {
        console.error('Error toggling task completion:', error);
    }
};


    const handleEditTask = async (id, newTitle, newDescription, newCompletionDate) => {
        try {
            console.log("ID : ", id);
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
            });
    
            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(tasks.map(task =>
                    task._id === id ? updatedTask : task
                ));
            } else {
                console.error('Failed to update task', await response.text());
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    

    return (
        <section className="bg-white p-6 rounded-lg shadow-md">
            {/* Task Creation Form */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h3>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Task Title"
                />
                <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full mt-2"
                    placeholder="Task Description"
                />
                <input
                    type="date"
                    value={newCompletionDate}
                    onChange={(e) => setNewCompletionDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full mt-2"
                />
                <button
                    onClick={handleAddTask}
                    className="mt-2 p-2 bg-blue-600 text-white rounded-md"
                >
                    Add Task
                </button>
            </div>

            {/* Filter and Sort Options */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <label className="mr-2">Filter:</label>
                        <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            <option value="all">All</option>
                            <option value="completed">Completed</option>
                            <option value="incomplete">Incomplete</option>
                        </select>
                    </div>
                    <div>
                        <label className="mr-2">Sort by:</label>
                        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            <option value="creationDate">Creation Date</option>
                            <option value="completionDate">Completion Date</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Task List */}
            {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((task) => (
                    <Task
                        key={task._id}
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
