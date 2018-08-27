var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    Post            = require("../models/post.js"),
    Category        = require("../models/category.js"),
    User            = require("../models/user.js");


// CATEGORY - INDEX ROUTE
router.get("/", function(req, res){
  Category.find({}, function(err, allCategories){
      if(err){
          return res.redirect("/");
      } 
      res.render("categories/index", {categories: allCategories});
  }); 
});

// CATEGORY - NEW ROUTE
router.get("/new", function(req, res){
    res.render("categories/new");
});

// CATEGORY - CREATE ROUTE
router.post("/", function(req, res){
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

module.exports = router;