const express = require('express');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');

const signup = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Added context to the log for better understanding
        const { email, name, phone, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ email, name, phone, password: passwordHash});
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, "ashfkajsddlkjas", { expiresIn: "24h" });
        if (!token) {
            return res.status(400).json({message: 'Token not found'})
        }
        newUser.token = token;
        await newUser.save();
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({ message: 'User created successfully', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error in signup process', error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid password'})
        }
        const token = jwt.sign({ id: user._id }, "ashfkajsddlkjas", { expiresIn: "24h" });
        if(!token) {
            return res.status(400).json({message: 'Token not found'})
        }
        user.token = token;
        await user.save();
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(200).json({ message: 'User logged in successfully', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error in login process', error: error.message });
    }
}

module.exports = {
    signup,
    login
}
