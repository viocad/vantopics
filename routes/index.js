var express         = require("express"),
    router          = express.Router(),
    middleware      = require("../middleware"),
    passport        = require("passport"),
    Post            = require("../models/post.js"),
    Category        = require("../models/category.js"),
    User            = require("../models/user.js"),
    Contact         = require("../models/contact.js"),
    Recaptcha       = require("express-recaptcha").Recaptcha;

var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITEKEY, process.env.RECAPTCHA_SECRETKEY);

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
        Post.count({ "draft": {$eq: "0"} }, function(err, numPosts){
            if(err){
                return console.log("Error when getting total number of posts");
            }
            var numPages = Math.ceil(numPosts/size);
            Post.find({ "draft": {$eq: "0"} }, {}, cursor, function(err, allPosts){
               if(err){
                   return console.log(err);
               }
               Category.find({}, function(err, allCategories){
                   if(err){
                       return console.log(err);
                   }
                   res.render("index", {posts: allPosts, pages: numPages, categories: allCategories});
               });
            });    
        });
});

// ABOUT ROUTE
router.get("/about", function(req, res) {
    Category.find({}, function(err, allCategories){
        if(err){
            return console.log(err);
        }
        res.render("about", {categories: allCategories});
    });
});

// CONTACT ROUTE (NEW)
router.get("/contact", function(req, res) {
    Category.find({}, function(err, allCategories){
        if(err){
            return console.log(err);
        }
        res.render("contact", {categories: allCategories});
    });
});

// CONTACT CREATE ROUTE
router.post("/contact", recaptcha.middleware.verify, middleware.checkcaptcha, function(req, res){
    Category.find({}, function(err, allCategories){
        if(err){
            return console.log(err);
        }
        Contact.create(req.body.contact, function(err, newlyCreated){
            if(err){
                req.flash("error", "系統出錯，未能提交留言，請稍後再試！");
            }
            req.flash("success", "我們已收到您的留言，會盡快回復您的！");
            res.redirect("/");
        });
        
    });
});

module.exports = router;