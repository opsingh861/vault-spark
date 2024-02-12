import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import * as authService from '../services/authService.js';

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long', success: false });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email', success: false });
        }
        const getUser = await User.findOne({ username });
        if (getUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        const user = await User.findOne({ username});
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }
        const token = authService.generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
