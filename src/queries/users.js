import User from "../app/models/user";

export async function createUser(userData) {
    try {
        console.log(User);
        console.log("User data: ", userData);  // Logowanie userData
        const user = await User.create(userData); 
        console.log("User created: ", user);  // Logowanie utworzonego użytkownika
        return user;
    } catch (e) {
        console.error("Error creating user: ", e);  // Logowanie błędu
        throw new Error(e.message);
    }
}
