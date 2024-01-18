const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    tokens: [{ type: String }],
});

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, secretKey,{ algorithm: 'HS256' });
    user.tokens = user.tokens.concat(token);
    return token;
};

// Remove sensitive information before sending user object
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject._id; // Remove _id field
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
