import mongoose, { Schema } from "mongoose";

const userSchema = new Schema ({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
});

const User = mongoose.models.User ?? mongoose.model("User", userSchema);
export default User;