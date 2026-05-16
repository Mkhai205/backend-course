import { userRepository } from "../repository/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET:", JWT_SECRET);

export const register = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({ email, password: hashedPassword, role });
    const savedUser = await userRepository.save(newUser);

    res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password 1" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password 2" });
    }

    const payload = {
        userId: user.id,
        role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token123", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Login successful" });
};
