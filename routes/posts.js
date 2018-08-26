var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    Post            = require("../models/post.js"),
    User            = require("../models/user.js");


// POST - NEW ROUTE
router.get("/new", function(req, res){
   res.render("posts/new");
});

// POST - CREATE ROUTE
router.post("/", function(req, res){
    // get post data from webpage
    var newPost = req.body.post; 
    // create a new post and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to posts page
            res.redirect("/posts/" + newlyCreated._id);
        }
    });
});

// POST - SHOW ROUTE
router.get("/:id", function(req, res){
    // find the post with provided id
    Post.findById(req.params.id).exec(function(err, foundPost){
        if(err || !foundPost){
            // req.flash("error", "Sorry, that post does not exist.");
            return res.redirect("/");
        } 
        // render show template with that post
        res.render("posts/show", {post: foundPost});
    });
});

// POST - EDIT ROUTE
router.get("/:id/edit", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
            return res.redirect("/");
        }
        res.render("posts/edit", {post: foundPost});
    });
});

// POST - UPDATE ROUTE
router.put("/:id", function(req, res){
   Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
      if(err || !updatedPost){
          return res.redirect("/");
      } 
      res.redirect("/posts/" + updatedPost._id);
   });
});

// POST - DESTROY ROUTE
router.delete("/:id", function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err, foundPost){
       if(err || !foundPost){
           return res.redirect("/");
       }
       res.render("posts/index");
    });
});

module.exports = router;