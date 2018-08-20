var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    password: {
        type: String,
        require: true},
    displayName: String,
    email: {
        type: String,
        unique: true,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);