'use client'

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { Pencil, Trash2, CheckCircle, XCircle, Save } from "lucide-react"

interface TaskProps {
  task: {
    _id: string
    title: string
    description?: string
    completed: boolean
    creationDate: string
    completionDate?: string
  }
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onEdit: (id: string, title: string, description: string, completionDate: string) => void
}

export default function Task({ task, onDelete, onToggleComplete, onEdit }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description || "")
  const [completionDate, setCompletionDate] = useState(task.completionDate || "")

  useEffect(() => {
    setEditedTask(task.title)
    setEditedDescription(task.description || "")
    setCompletionDate(task.completionDate ? dayjs(task.completionDate).format('YYYY-MM-DD') : "")
  }, [task])

  const handleEdit = () => setIsEditing(!isEditing)

  const handleSave = () => {
    onEdit(task._id, editedTask, editedDescription, completionDate)
    setIsEditing(false)
  }

  return (
    <div className={`p-6 rounded-lg shadow-md ${task.completed ? 'bg-green-50' : 'bg-white'} mb-4 transition-all duration-300 ease-in-out hover:shadow-lg`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a description"
          />
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Set completion date"
          />
        </div>
      ) : (
        <div>
          <h4 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h4>
          {task.description && <p className="mt-2 text-gray-600">{task.description}</p>}
          <div className="mt-4 space-y-1">
            <p className="text-sm text-gray-500">
              Created: {dayjs(task.creationDate).format('DD/MM/YYYY')}
            </p>
            {!task.completed && task.completionDate && (
              <p className="text-sm text-gray-500">
                Due: {dayjs(task.completionDate).format('DD/MM/YYYY')}
              </p>
            )}
            {task.completed && (
              <p className="text-sm text-green-600">
                Completed: {dayjs(new Date()).format('DD/MM/YYYY')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onToggleComplete(task._id)}
          className={`p-2 rounded-full ${task.completed ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'} transition-colors duration-300`}
        >
          {task.completed ? <XCircle size={20} /> : <CheckCircle size={20} />}
        </button>
        {isEditing ? (
          <button onClick={handleSave} className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-300">
            <Save size={20} />
          </button>
        ) : (
          <button onClick={handleEdit} className="p-2 rounded-full text-yellow-600 hover:bg-yellow-100 transition-colors duration-300">
            <Pencil size={20} />
          </button>
        )}
        <button onClick={() => onDelete(task._id)} className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-300">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}