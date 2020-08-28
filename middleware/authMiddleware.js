const jwt = require('jsonwebtoken');

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

module.exports = { requireAuth };