const { response } = require("express")
const User = require('../models/User');

// Error Handlers
const handleError = (err) => {
    console.log(err.message, err.code);
    let errorResponses = { email: "", password: "" };

    //duplication errors
    if (err.code === 11000) {
        errorResponses.email = "The email is already registerd";
    }


    // validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach((error) => {
            errorResponses[error.properties.path] = error.properties.message;
        });
    }


    return errorResponses;
}


// Get
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

// Posts
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        res.status(201).json(user);
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json(errors);
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email)
    } catch (err) {

    }
    res.send('new login');
}


module.exports.logout_get = (req, res) => {
    res.render('new logout');
}