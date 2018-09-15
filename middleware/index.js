var Post            = require("../models/post"),
    Category        = require("../models/category"),
    User            = require("../models/user");

// all the middlewares go here
var middlewareObj = {};

middlewareObj.isAdmin = function(req, res, next){
    if(req.body.adminCode != process.env.ADMIN_CODE){
        req.flash("error", "You shouldn't be here!");
        return res.redirect("/");
    }
    next();
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be admin to do that."); // use "success" for green color and "error" for red color (nth with bootstrap, it's our own key, it can be whatever word)
    // adding req.flash before res.redirect will not show flash right away.. this line will allow us to pass in the flash message to /login in this case when we render /login
    // next step: go to app.js and pass in the message to all routes using res.locals
    res.redirect("/");
};

middlewareObj.checkcaptcha = function(req, res, next){
    if(!req.recaptcha.error){
        next();
    } else{
        req.flash("error", "Please prove you are human. =)");
        res.redirect("back");
    }    
};

module.exports = middlewareObj;