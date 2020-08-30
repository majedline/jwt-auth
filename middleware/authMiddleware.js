const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { response } = require('express');

const requireAuth = (req, res, next) => {
    // get the cookie
    const token = req.cookies.jwt;

    // check if token exists & is verified
    if (token) {
        // check the signature of the token
        jwt.verify(token, "mySecretPassword", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            } else {
                console.log(decodedToken);
                next();
            }
        });

    } else {
        // token not found so send the user to the login page.
        res.redirect("/login");

    }
}

// check current user
const checkUser = (req, res, next) => {
    // get the cookie
    const token = req.cookies.jwt;

    // check if token exists & is verified
    if (token) {
        // check the signature of the token
        jwt.verify(token, "mySecretPassword", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
                
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });

    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };