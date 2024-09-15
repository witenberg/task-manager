import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  creationDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // referencja do użytkownika
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
