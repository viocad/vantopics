var Post            = require("../models/post"),
    Category        = require("../models/category"),
    User            = require("../models/user");

// all the middlewares go here
var middlewareObj = {};

middlewareObj.isAdmin = function(req, res, next){
    if(req.body.adminCode != process.env.ADMIN_CODE){
        req.flash("error", "不好意思，您應該走錯地方了。");
        return res.redirect("/");
    }
    next();
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "啊！閒人勿進！"); 
    res.redirect("/");
};

middlewareObj.checkcaptcha = function(req, res, next){
    if(!req.recaptcha.error){
        next();
    } else{
        req.flash("error", "請先證明您是個人 =）");
        res.redirect("back");
    }    
};

module.exports = middlewareObj;