import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "admin",
    },
    {
        name: "John Doe",
        email: "user@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "user",
    },
];

export default users;
