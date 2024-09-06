import mongoose from "mongoose";

export async function dbConnect() {
    try {
        const conn = await mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING))
        return conn;
    } catch (e) {
        //console.log("AAAAAAAAAAAAAAAAA");
        throw new Error(e);

    }
};