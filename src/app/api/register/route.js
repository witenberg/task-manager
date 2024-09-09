import { NextResponse } from "next/server";
import { createUser } from "../../../queries/users"
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../lib/mongo";
import { findUserByEmail } from "../../../queries/users"

export const POST = async (request) => {
    const {name, email, password} = await request.json();

    console.log(name, email, password);

    await dbConnect();

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return new NextResponse("User with this email already exists", {
            status: 409,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 3);

    const newUser = {
        name,
        email,
        password: hashedPassword,
    }
    try {
        await createUser(newUser);
        return new NextResponse("User has been created", {
            status: 201,
        });
    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
    
}