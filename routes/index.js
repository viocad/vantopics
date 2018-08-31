var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    Post            = require("../models/post.js"),
    Category        = require("../models/category.js")
    User            = require("../models/user.js");
    // multer          = require("multer"),
    // cloudinary      = require("cloudinary"),
    // Recaptcha       = require("express-recaptcha").Recaptcha;


// PUBLIC INDEX ROUTE
router.get("/", function(req, res){
    // get all posts from DB and pass to webpage
    Post.find({}, function(err, allPosts){
       if(err){
           console.log(err);
       } else{
           res.render("index", {posts: allPosts});
       }
    });
});

// ADMIN INDEX ROUTE
router.get("/admin", function(req, res){
    Post.find({}, function(err, allPosts){
        if(err){
            return res.redirect("/admin");
        } 
        res.render("posts/index", {posts: allPosts});
    });
});

module.exports = router;