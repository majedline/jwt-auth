const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'basic',
        enum: ["basic", "supervisor", "admin"]
    },
    page: {
        type: String,
        default: 'home',
        enum: ["home", "smoothies", "admin"]
    },
    action: {
        type: String,
        default: 'none',
        enum: ["none", "read", "write", "all"]
    }

});

/************************ Hooks ************************/

// fire a function AFTER a save to the db
permissionSchema.post('save', function (doc, next) {
    //console.log(doc);
    next(); // Go to the next middleware
});

// fire a function BEFORE a save to the db
permissionSchema.pre('save', async function (next) {
    //console.log(this);
    next();// Go to the next middleware
});

const Permission = mongoose.model('permission', permissionSchema);

module.exports = Permission;