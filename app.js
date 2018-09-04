// REQURIE DONENV
require('dotenv').config();

// DEFINING VARIABLES
var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override"),
    session                 = require("cookie-session"),
    cookieParser            = require("cookie-parser"),
    flash                   = require("connect-flash"),
    indexRoutes             = require("./routes/index"),
    User                    = require("./models/user"),
    userRoutes              = require("./routes/users"),
    postRoutes              = require("./routes/posts"),
    categoryRoutes          = require("./routes/categories"),
    publicCategoryRoutes    = require("./routes/publiccategories");

// BASIC CONFIG
mongoose.connect(process.env.DB_URL);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// REQUIRE MOMENT.JS
// app.locals.moment = require("moment");

// PASSPORT CONFIGURATION
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 60000 }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// the last 3 lines come with passport-local-mongoose package

app.use(flash(app));

// RES.LOCALS
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ROUTES
app.use(indexRoutes);
app.use("/admin", userRoutes);
app.use("/posts", postRoutes);
app.use("/admin/categories", categoryRoutes);
app.use("/categories", publicCategoryRoutes);


// STARTUP SERVER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("VanTopics Server Has Started!!");
});