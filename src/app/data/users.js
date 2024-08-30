const users = [
    {
        email: "abc@email.com",
        password: "password"
    },
    {
        email: "xyz@email.com",
        password: "password"
    },
]

export const getUserByEmail = email => {
    const found = users.find(user => user.email == email);
    return found;
}