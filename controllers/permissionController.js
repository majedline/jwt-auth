const { response } = require("express")
const Permission = require('../models/Permission');


// Error Handlers
const handleError = (page, err) => {
    console.log(err.message, err.code);
    let errorResponses = { action: page, message: "" };

    if (err.message === "Permission denied") {
        errorResponses.message = "You do not have the proper permissions to access the " + page + " page.";
    }
    return errorResponses;
}


// Get handlers
module.exports.admin_get = (req, res) => {
    res.render('admin');
}

// Post Handlers
module.exports.admin_post = async (req, res) => {
    res.status(201).json({});

    try {
        res.status(201).json({});
    } catch (err) {
        const errors = handleError(page, err);
        res.status(400).json({ errors: errors });
    }

}