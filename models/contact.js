var mongoose    = require("mongoose");

var contactSchema = mongoose.Schema({
    name: String,
    email: String,
    content: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("Contact", contactSchema);