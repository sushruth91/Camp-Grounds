var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");    
 
//connecting to mongoDB and creating a new db called "yelp_camp" in it.
mongoose.connect("mongodb://localhost:27017/yelp_camp_v12"); 

/*to use static pages with EXPRESS, always put the static files in a public directory.
 and use the below line of code to include those files*/
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));
app.use(flash()); //needs to be before passport configuration.
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //arguments in render() treated as '.ejs'
// seedDB(); //seed the Database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "saurabh somani likes liverpool",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware which passes 'req.user' to every route explicitly.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //very imp to add this line, else the middleware won't pass the control to next argument.
});

/* In below code "/campgrounds" is being appended to the start of every argument in router.get/post.
This will amke the first argument of router.get/post in routes/campground.js look like "/campgrounds"
So we DRY up our code efficiently and only need to write "/" instead of "/campgrounds'
Same logic applied for 'commentRoutes'*/

app.use("/", indexRoutes); 
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Starting Node server
app.listen(3000, function(){
   console.log("YelpCamp version 12 listening now !!"); 
});
