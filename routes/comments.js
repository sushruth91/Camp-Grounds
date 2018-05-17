var express    = require("express"),
    //'mergeParams: true' for linking between objects of different models.
    router     = express.Router({mergeParams: true}), 
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

// ================
// COMMENTS routes
// ================
/* nested RESTful routing, 'comments/new' is nested inside '/campgrounds/:id',
because we need the 'id' in the 'comments/new' */

// Comments NEW Route
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find Campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });    
});

// Comments CREATE Route
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup Campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //create a new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    //connecting new comment to campground
                    campground.comments.push(comment._id);
                    campground.save();
                    req.flash("success", "successfully added comment");
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    }); 
});

// Comments EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No Campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
             // 'req.params.id' contains the ':id' of "/campgrounds/:id", which is defined is 'app.js'
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });      
    });
});

// Comments UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
        // 'req.params.id' contains the ':id' of "/campgrounds/:id", which is defined is 'app.js'
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            // redirects to show page
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;