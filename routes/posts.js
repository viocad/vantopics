var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    middleware      = require("../middleware"),
    Post            = require("../models/post.js"),
    Category        = require("../models/category.js"),
    User            = require("../models/user.js");


// POST - NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    Category.find({}, function(err, allCategories){
        if(err){
            return res.redirect("/");
        }
        res.render("posts/new", {categories: allCategories});
    });
});

// POST - CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    // get post data from webpage
    var newPost = req.body.post;
    Category.findById(req.body.category, function(err, foundCategory){
        if(err || !foundCategory){
            return res.redirect("/");
        }
        newPost.category = {
            id: req.body.category,
            name: foundCategory.name
        }; 
        newPost.author = {
            id: req.user._id,
            name: req.user.username
        }
        
        // create a new post and save to DB
        Post.create(newPost, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                res.redirect("/posts/" + newlyCreated._id);
            }
        });
    });
});

// POST - SHOW ROUTE
router.get("/:id", function(req, res){
    // find the post with provided id
    Category.find({}, function(err, allCategories) {
        if(err){
            return console.log(err);
        }
        Post.findById(req.params.id).exec(function(err, foundPost){
            if(err || !foundPost){
                // req.flash("error", "Sorry, that post does not exist.");
                return res.redirect("/");
            } 
            // render show template with that post
            res.render("posts/show", {post: foundPost, categories: allCategories});
        });
    });
});

// POST - EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
            return res.redirect("/admin");
        }
        Category.find({_id: {$ne: foundPost.category.id}}, function(err, allCategories){
            if(err){
                return res.redirect("/admin")
            }
            res.render("posts/edit", {post: foundPost, categories: allCategories});
        });
        
    });
});

// POST - UPDATE ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
    var postToUdate = req.body.post;
    Category.findById(req.body.category, function(err, foundCategory) {
        if(err || !foundCategory){
            return res.redirect("/admin");
        }
        postToUdate.category = {
        id: req.body.category,
        name: foundCategory.name
        }
        
        Post.findByIdAndUpdate(req.params.id, postToUdate, function(err, updatedPost){
          if(err || !updatedPost){
              return res.redirect("/");
          } 
          res.redirect("/posts/" + updatedPost._id);
       });
    });
});

// POST - DESTROY ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err, foundPost){
       if(err || !foundPost){
           return res.redirect("/");
       }
       res.redirect("/admin");
    });
});

module.exports = router;