const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password length is 6 characters"]
    }
});

/************************ Hooks ************************/

// fire a function AFTER a save to the db
userSchema.post('save', function (doc, next) {
    console.log("new user was created", doc);
    next(); // Go to the next middleware
});

// fire a function BEFORE a save to the db
userSchema.pre('save', function (next) {
    console.log("user about to be saved", this);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;