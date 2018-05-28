var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    User            = require("../models/user.js");
    // multer          = require("multer"),
    // cloudinary      = require("cloudinary"),
    // Recaptcha       = require("express-recaptcha").Recaptcha;

router.get("/", function(req, res){
    res.render("index");
})

module.exports = router;