var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

// Root Route
router.get("/", function(req, res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========
// SHOW register form route
router.get("/register", function(req, res){
    res.render("register");
});

//this route will handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){ 
        //'user' contains data of newly created user, i.e., 'username' & 'password'
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//this route handles login logic
// skeleton of below route --> app.post("/login", middleware, callbackFunction)
router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//this route is for 'logout' (its just a 'get' route)
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;