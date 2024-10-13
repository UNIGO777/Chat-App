const jwt = require('jsonwebtoken');
const express = require('express');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, "ashfkajsddlkjas")
    if (!decoded) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
}
    
module.exports = { verifyToken };
