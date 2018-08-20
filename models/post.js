var mongoose = require("mongoose");

// SCHEMA SETUP
var postSchema = new mongoose.Schema({
   title: String,
   firstPara: String,
   content: String,
   createdAt: {
      type: Date,
      default: Date.now
   },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [ // reference to the comment using id
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }   
   ]
});

module.exports = mongoose.model("Post", postSchema);