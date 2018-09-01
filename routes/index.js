var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    Post            = require("../models/post.js"),
    Category        = require("../models/category.js"),
    User            = require("../models/user.js");
    // multer          = require("multer"),
    // cloudinary      = require("cloudinary"),
    // Recaptcha       = require("express-recaptcha").Recaptcha;


// PUBLIC INDEX ROUTE
router.get("/", function(req, res){
    // pagination
    var pageNo = parseInt(req.query.pageNo);
    var size = 10;
    var cursor = {}
    if(pageNo < 0 || pageNo === 0){
        return console.log("error");
    }
    cursor.sort = {createdAt: -1};
    cursor.skip = size * (pageNo-1);
    cursor.limit = size;
    // get all posts from DB and pass to webpage
    Post.count({}, function(err, numPosts){
        if(err){
            return console.log("Error when getting total number of posts");
        }
        var numPages = Math.ceil(numPosts/size);
        Post.find({}, {}, cursor, function(err, allPosts){
           if(err){
               return console.log(err);
           }
           /*allPosts.forEach(function(post){
               console.log(post.createdAt);
           });*/
           Category.find({}, function(err, allCategories){
               if(err){
                   return console.log(err);
               }
               res.render("index", {posts: allPosts, pages: numPages, categories: allCategories});
           });
        });    
    });
});

// ADMIN INDEX ROUTE
router.get("/admin", function(req, res){
    // pagination
    var pageNo = parseInt(req.query.pageNo);
    var size = 10;
    var cursor = {}
    if(pageNo < 0 || pageNo === 0){
        return console.log("error");
    }
    cursor.sort = {createdAt: -1};
    cursor.skip = size * (pageNo-1);
    cursor.limit = size;
    // get all posts from DB
    Post.count({}, function(err, numPosts){
        if(err){
            return console.log("Error when getting total number of posts");
        }
        var numPages = Math.ceil(numPosts/size);
        Post.find({}, {}, cursor, function(err, allPosts){
            if(err){
                return res.redirect("/admin");
            } 
            res.render("posts/index", {posts: allPosts, pages: numPages});
        });
    });
});

module.exports = router;