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
    if(req.query.search){
        Post.count({$text: {$search : req.query.search}}, function(err, numPosts){
            if(err){
                return console.log("Error when getting total number of posts");
            }
            
            var numPages = Math.ceil(numPosts/size);
            
            Post.find({$text: {$search : req.query.search}}, function(err, foundPosts){
                if(err || !foundPosts || foundPosts <= 0){
                    req.flash("error", "抱歉，沒有您要找的資料 =（");
                    return res.redirect("/");
                }
                
                Category.find({}, function(err, allCategories){
                   if(err){
                       return console.log(err);
                   }
                    return res.render("search", {posts: foundPosts, categories: allCategories, pages: numPages});
                });
            });
        });
    } else {
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
               Category.find({}, function(err, allCategories){
                   if(err){
                       return console.log(err);
                   }
                   res.render("index", {posts: allPosts, pages: numPages, categories: allCategories});
               });
            });    
        });
    }
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

// SEARCH POST ROUTE
/*router.post("/search", function(req, res){
    
    if(req.body.query && req.body.query > 0){
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
        
        Post.count({$text: {$search: req.body.query}}, function(err, numPosts){
            if(err){
                return console.log("Error when getting total number of posts");
            }
            
            var numPages = Math.ceil(numPosts/size);
            
            Post.find({$text: {$search: req.body.query}}, function(err, foundPosts){
                if(err || !foundPosts || foundPosts <= 0){
                    req.flash("error", "抱歉，沒有您要找的資料 =（");
                    return res.redirect("/");
                }
                
                Category.find({}, function(err, allCategories){
                   if(err){
                       return console.log(err);
                   }
                    return res.render("search", {posts: foundPosts, categories: allCategories, pages: numPages});
                });
            });
        });
    }
});*/

module.exports = router;