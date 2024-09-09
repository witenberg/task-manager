import { useState } from "react";
import dayjs from "dayjs"; 

const Task = ({ task, onDelete, onToggleComplete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [completionDate, setCompletionDate] = useState(task.completionDate || "");

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onEdit(task.id, editedTask, editedDescription, completionDate);
    setIsEditing(false);
  };

  return (
    <div className={`p-4 rounded-lg shadow ${task.completed ? 'bg-green-100' : 'bg-gray-100'} mb-2`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            placeholder="Add a description"
          />
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            placeholder="Set completion date"
          />
        </>
      ) : (
        <>
          <h4 className={`text-lg font-semibold ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h4>
          <p>{task.description}</p>
          <p className="text-sm text-gray-500">
            Created: {dayjs(task.creationDate).format('DD/MM/YYYY')}
          </p>
          {task.completed && task.completionDate && (
            <p className="text-sm text-green-600">
              Completed: {dayjs(task.completionDate).format('DD/MM/YYYY')}
            </p>
          )}
        </>
      )}

      <div className="mt-2 flex justify-end space-x-2">
        <button onClick={() => onToggleComplete(task.id)} className="text-blue-600">
          {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
        {isEditing ? (
          <button onClick={handleSave} className="text-green-600">Save</button>
        ) : (
          <button onClick={handleEdit} className="text-yellow-600">Edit</button>
        )}
        <button onClick={() => onDelete(task.id)} className="text-red-600">Delete</button>
      </div>
    </div>
  );
};

export default Task;