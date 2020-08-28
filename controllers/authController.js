const { response } = require("express")
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Error Handlers
const handleError = (err) => {
    console.log(err.message, err.code);
    let errorResponses = { email: "", password: "" };

    //duplication errors
    if (err.code === 11000) {
        errorResponses.email = "The email is already registerd";
        return errorResponses;
    }

    // validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach((error) => {
            errorResponses[error.properties.path] = error.properties.message;
        });
    }

    if (err.message === "Incorrect email") {
        errorResponses.email = "The email not found";
    }

    if (err.message === "Incorrect password") {
        errorResponses.password = "The password not correct";
    }


    return errorResponses;
}

// 3 days
const maxAge = 3 * 24 * 60 * 60;

// jwt Handlers
const createToken = (id) => {
    return jwt.sign({ id }, 'mySecretPassword', { expiresIn: maxAge });
}

// Get handlers
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

// Post Handlers
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors: errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors: errors });
    }
}


module.exports.logout_get = (req, res) => {
    res.render('new logout');
}