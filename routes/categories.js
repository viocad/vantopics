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
    Post.find({}, function(err, allPosts){
        if(err){
            return console.log(err);
        }
        Category.find({}, function(err, allCategories){
          if(err){
              req.flash("error", "Category.find()出問題！");
              return res.redirect("/admin");
          } 
          res.render("categories/index", {categories: allCategories, posts: allPosts});
        }); 
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
            req.flash("error", "系統錯誤，創立不了新分類！");
            res.redirect("/admin");
        } else {
            req.flash("success", "成功創建分類");
            res.redirect("/admin/categories");
        }
    });
});

// CATEGORY - SHOW ROUTE
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    // pagination
    var pageNo = parseInt(req.query.pageNo);
    var size = 10;
    var cursor = {};
    if(pageNo < 0 || pageNo === 0){
        return console.log("error");
    }
    cursor.sort = {createdAt: -1};
    cursor.skip = size * (pageNo-1);
    cursor.limit = size;
    Post.count({"category.id": {$eq: req.params.id}}, function(err, numPosts){
        if(err){
            return console.log("Error when getting total number of posts");
        }
        var numPages = Math.ceil(numPosts/size);
        Post.find({ "category.id": req.params.id }, function(err, foundPosts){
            if(err || !foundPosts){
                req.flash("error", "Post.find()出問題！");
                return res.redirect("/admin");
            } 
            res.render("categories/show", {posts: foundPosts, pages: numPages, pageNo: pageNo});
        }); 
    });
});

// CATEGORY - EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res) {
    Category.findById(req.params.id).exec(function(err, foundCategory){
        if(err || !foundCategory){
            req.flash("error", "系統錯誤，沒找到你要的分類！");
            return res.redirect("/admin");
        }    
        res.render("categories/edit", {category: foundCategory}); 
    });
});

// CATEGORY - UPDATE ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
    Category.findByIdAndUpdate(req.params.id, req.body.category, function(err, updatedCategory){
        if(err){
            req.flash("error", "系統錯誤，再試一下！");
            return res.redirect("/admin");
        }
        req.flash("success", "成功更新分類");
        res.redirect("/admin/categories");
    });
});

// CATEGORY - DESDROY ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Category.findByIdAndRemove(req.params.id, function(err, foundCategory){
        if(err || !foundCategory){
            req.flash("error", "系統錯誤，再試一下！");
            return res.redirect("/admin");
        } 
        req.flash("success", "成功刪除分類");
        res.redirect("/admin/categories");
    });
});


module.exports = router;