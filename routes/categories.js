var express         = require("express"),
    router          = express.Router(),
    middleware      = require("../middleware"),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    Post            = require("../models/post.js"),
    Category        = require("../models/category.js"),
    User            = require("../models/user.js");


// CATEGORY - INDEX ROUTE
router.get("/", middleware.isLoggedIn, function(req, res){
  Category.find({}, function(err, allCategories){
      if(err){
          return res.redirect("/");
      } 
      res.render("categories/index", {categories: allCategories});
  }); 
});

// CATEGORY - NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("categories/new");
});

// CATEGORY - CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    // get category data from webpage
    var newCategory = req.body.category; 
    // create a new category and save to DB
    Category.create(newCategory, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else {
            res.redirect("/admin/categories");
        }
    });
});

// CATEGORY - SHOW ROUTE
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Post.find({ "category.id": req.params.id }, function(err, foundPosts){
        if(err || !foundPosts){
            return res.redirect("/admin");
        } 
        res.render("categories/show", {posts: foundPosts});
    }); 
});

// CATEGORY - EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res) {
    Category.findById(req.params.id).exec(function(err, foundCategory){
        if(err || !foundCategory){
            return res.redirect("/admin");
        }    
        res.render("categories/edit", {category: foundCategory}); 
    });
});

// CATEGORY - UPDATE ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
    Category.findByIdAndUpdate(req.params.id, req.body.category, function(err, updatedCategory){
        if(err){
            return res.redirect("/admin");
        }
        res.redirect("/admin/categories");
    });
});

// CATEGORY - DESDROY ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Category.findByIdAndRemove(req.params.id, function(err, foundCategory){
        if(err || !foundCategory){
            return res.redirect("/admin");
        } 
        res.redirect("/admin/categories");
    });
});


module.exports = router;