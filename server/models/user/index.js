const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://via.placeholder.com/150',
    },
    token: {
        type: String,
        default: '',
    },
    clientId: {
        type: String,
        default: '',
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
