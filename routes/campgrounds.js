/* The callback function is inside of Campground.find(), 
so it receives what was found in allCampgrounds in an array.  
res.render tells the page to load a specific file, often the ejs file. 
{campgrounds: allCampgrounds} is taking allCampgrounds from what the Campground.find() produced 
and putting its value inside of 'campgrounds', which is an array variable in one of the ejs files. 
Then, we can use the data of campgrounds in the ejs file itself. 
This is how we move the data from js file to ejs file*/


/* "campgrounds" is what mongoDB has created inside itself.
This happens because we compiled schema into model (see above), 
so mongoDB made the instance of var "Campground"(present in app.js) to "campgrounds".
Hence while using any RESTful route, we pass in "campgrounds" as our first argument.
The RESTful route then fetches it from mongoDB and displays it on a page on web.
To make sure that it is being displayed to page on web, we add "/" at the beginning of "campgrounds" in the argument
*/

var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// =================
// CAMPGROUND ROUTES
// =================

//INDEX-ROUTE show all campgrounds
router.get("/", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            //redirecting to 'campgrounds.ejs' and passing the array.
            // 'req.user' will return 'username' & 'id' once the user has signed up, else it will return undefined.
             res.render("campgrounds/index", {campgrounds: allCampgrounds}); 
        }
    });   
});

//CREATE-ROUTE add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
    var price = req.body.price;
	var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	// create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW-ROUTE show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW-ROUTE shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided id, 'findById' is a method of mongoDB
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            // console.log(err);
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        else{
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground}); 
    }); 
});

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        /* 'req.params.id' is fetching ':id' from 'router.put' .
            'req.body.campground' is fetching name, image & description from 'edit.ejs', into a single object 'campground' */
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    //redirect somewhere(show page)
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;