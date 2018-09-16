var mongoose = require("mongoose");

// SCHEMA SETUP
var draftSchema = new mongoose.Schema({
   title: String,
   content: String,
   createdAt: {
      type: Date,
      default: new Date()
   },
   category: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category"
      },
      name: String
   },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      name: String
   }
});

module.exports = mongoose.model("Draft", draftSchema);