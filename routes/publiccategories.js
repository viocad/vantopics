var express         = require("express"),
    router          = express.Router(),
    Post            = require("../models/post.js"),
    Category        = require("../models/category.js");
    
// PUBLIC CATEGORY INDEX ROUTE
router.get("/", function(req, res){
    // get all categories from DB and pass to webpage
   Category.find({}, function(err, allCategories){
       if(err){
           return console.log(err);
       }
       res.render("categories/public/index", {categories: allCategories});
    });
});

// PUBLIC CATEGORY SHOW ROUTE
router.get("/:id", function(req, res){
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
    Post.count({"category.id": {$eq: req.params.id}}, function(err, numPosts){
        if(err){
            return console.log("Error when getting total number of posts");
        }
        var numPages = Math.ceil(numPosts/size);
        Post.find({"category.id": {$eq: req.params.id}}, {}, cursor, function(err, categoryPosts){
           if(err){
               return console.log(err);
           }
           Category.find({}, function(err, allCategories){
               if(err){
                   return console.log(err);
               }
               res.render("categories/public/show", {posts: categoryPosts, pages: numPages, categories: allCategories});
           });
        });    
    });
});

module.exports = router;