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
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open',
    },
    createdBy: {
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
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Ticket = mongoose.models.Ticket ?? mongoose.model('Ticket', ticketSchema);
export default Ticket;
