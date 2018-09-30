var mongoose = require("mongoose");

// SCHEMA SETUP
var postSchema = new mongoose.Schema({
   title: String,
   content: String,
   createdAt: {
      type: Date,
      default: new Date()
   },
   draft: {
      type: String,
      default: "0"
   },
   featuredImage: String,
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

module.exports = mongoose.model("Post", postSchema);