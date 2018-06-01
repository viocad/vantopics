var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user.js"),
    Quill           = require("quill");

var editor = new Quill("#editor", {
   modules: {toolbar:"#toolbar"},
   theme: "snow"
});
    
// NEW ROUTE
router.get("/new", function(req, res){
   res.render("posts/new");
});    

module.exports = router;