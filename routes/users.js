var express         = require("express"),
    router          = express.Router(),
    middleware      = require("../middleware"),
    passport        = require("passport"),
    Post            = require("../models/post"),
    User            = require("../models/user");
    
// register form
router.get("/puddingreg", function(req, res){
    res.render("users/register", {page: "register"});
});

// handle signup logic
router.post("/puddingreg", middleware.isAdmin, function(req, res){
    var newUser = new User(req.body.user);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "Try again!");
            return res.redirect("/admin/puddingreg");
        }
        passport.authenticate("local");
        req.login(user, function(err){
            if(err){
                return res.redirect("/");
            }
            res.redirect("/admin")
        });
        
    });
    
});

// login form
router.get("/login", function(req, res){
   res.render("users/admin", {page: "login"});
});

// handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/admin",
        failedRedirect: "/",
        failureFlash: true
    }), function(req, res){
});

// ADMIN INDEX ROUTE
router.get("/", middleware.isLoggedIn, function(req, res){
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