var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user.js");
    
// login form
router.get("/", function(req, res){
   res.render("users/admin");
});

// admin dashboard
router.get("/dashboard", function(req, res){
   res.render("users/admin-dashboard");
});


module.exports = router;