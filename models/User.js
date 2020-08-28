const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

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
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to log in user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error("Incorrect  password"); // incorrect password
    }
    throw Error("Incorrect email"); // incorrect email
}

const User = mongoose.model('user', userSchema);

module.exports = User;