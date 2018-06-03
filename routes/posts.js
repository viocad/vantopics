var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user.js");


// POST - ADMIN INDEX ROUTE
router.get("/admin", function(req, res){
   res.render("posts/index");
});
    
// POST - NEW ROUTE
router.get("/new", function(req, res){
   res.render("posts/new");
});    

module.exports = router;