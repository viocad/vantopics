var express         = require("express"),
    router          = express.Router(),
    middleware      = require("../middleware"),
    passport        = require("passport"),
    Recaptcha       = require("express-recaptcha").Recaptcha,
    Post            = require("../models/post"),
    Contact         = require("../models/contact"),
    User            = require("../models/user");
    
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITEKEY, process.env.RECAPTCHA_SECRETKEY);
    
// register form
router.get("/puddingreg", recaptcha.middleware.render, function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/admin");
    }
    res.render("users/register", {page: "register", captcha: res.recaptcha});
});

// handle signup logic
router.post("/puddingreg", middleware.isAdmin, recaptcha.middleware.verify, middleware.checkcaptcha, function(req, res){
    var newUser = new User(req.body.user);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "Try again!");
            return res.redirect("/admin/puddingreg");
        }
        // passport.authenticate("local");
        req.login(user, function(err){
            if(err){
                return res.redirect("/");
            }
            res.redirect("/admin")
        });
    });
});

// login form
router.get("/login", recaptcha.middleware.render, function(req, res){
   res.render("users/admin", {page: "login", captcha: res.recaptcha});
});

// handle login logic
router.post("/login", recaptcha.middleware.verify, middleware.checkcaptcha, passport.authenticate("local",
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

// ADMIN LOGOUT ROUTE

router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash("success", "Logged you out!"); // as we add res.locals.message = req.flash("error"); in app.js already, we can just add this line here to make the flash message show up
    res.redirect("/");
});

// CONTACT INDEX ROUTE

router.get("/contact", middleware.isLoggedIn, function(req, res){
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
    Contact.count({}, function(err, numContacts){
        if(err){
            return console.log("Error when getting numContacts");
        }
        var numPages = Math.ceil(numContacts/size);
        Contact.find({}, {}, cursor, function(err, allContacts){
            if(err){
                return res.redirect("/admin");
            }
            res.render("users/contact", {contacts: allContacts, pages: numPages});
        });
    });
});

module.exports = router;