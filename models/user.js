var mongoose                = require("mongoose");
    // passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    password: {
        type: String,
        require: true},
    displayName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    isAuthor: {
        type: Boolean,
        default: false},
});

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);