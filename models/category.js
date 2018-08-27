var mongoose                = require("mongoose");

var categorySchema = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model("Category", categorySchema);