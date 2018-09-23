var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    password: {
        type: String,
        require: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    displayName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);