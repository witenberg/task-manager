import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        type: String,
    },
    provider: {
        required: true,
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

const User = mongoose.models.User ?? mongoose.model("User", userSchema);
export default User;