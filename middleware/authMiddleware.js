const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Permission = require('../models/Permission');

// const { response } = require('express');
const { unsubscribe } = require('../routes/authRoutes');

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
                console.log("decodedToken", decodedToken);
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

const adminNeeded = async (req, res, next) => {
    console.log("******************************");
    console.log(req.path);
    let path = req.path;
    try {
        let userRole = await User.getUserRole(res.locals.user._id);

        // If the user is found and a role is found, then check it, otherwise diect the user to the login page.
        if (userRole) {
            console.log(userRole);

            // if the role allows for access to the page, then continue. Otherwise permissions denied.
            let permission = await Permission.findOne({ role: userRole.role, page: req.path });
            if (permission) {
                next();
            } else {
                res.redirect("/permissionDenied");
            }

        } else {
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
    }

}




module.exports = { requireAuth, checkUser, adminNeeded };