import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
    title: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
    category: {
        type: String,
        enum: ['task', 'bug', 'feature', 'other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    imageUrl: {
        type: String,
    },
    createdBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    taskId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: function() {
            return this.category === 'task';
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Ticket = mongoose.models.Ticket ?? mongoose.model('Ticket', ticketSchema);
export default Ticket;
