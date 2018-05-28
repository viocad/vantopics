// REQURIE DONENV
require('dotenv').config();

// DEFINING VARIABLES
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash"),
    indexRoutes         = require("./routes/index.js");

// BASIC CONFIG
mongoose.connect(process.env.DB_URL);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// RES.LOCALS
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});

// REQUIRE MOMENT.JS
app.locals.moment = require("moment");

// ROUTES
app.use(indexRoutes);
/*
app.use("/campgrounds", campgroundRoutes); 
app.use("/campgrounds/:id/comments", commentRoutes);*/


// STARTUP SERVER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("VanTopics Server Has Started!!");
});