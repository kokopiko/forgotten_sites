var express             = require("express"),
    router              = express.Router({mergeParams: true}),
    Site                = require("../models/sites.js"),
    Comment             = require("../models/comments.js"),
    middleWare      = require("../middleware/index.js");


//////////////////////SHOW NEW COMMENT FORM 
router.get("/new", middleWare.checkAuthentication, function(req, res){
    Site.findById(req.params.id, function(err, foundSite){
       if (err){
           console.log(err);
       } else {
           res.render("comments/newcomment", {site: foundSite});
       }
    });
});

////////////////////////////////////////////////////////////////
//////////////////////////////////POST Comments
////////////////////////////////////////////////////////////////

router.post("/", middleWare.checkAuthentication, function(req, res){
    Site.findById(req.params.id, function(err, foundSite) {
        if (err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, createdComment){
                if (err){
                    console.log(err);
                }else{
                    createdComment.author   = req.user;
                    createdComment.date     = Date.now();  
                    createdComment.save();
                };
                foundSite.comments.push(createdComment);
                foundSite.save(function(err, savedSite){
                    if (err){
                        console.log (err);
                    }
                });
                req.flash("success", "Comment added!");
                res.redirect("/sites/"+ foundSite._id);
                }
            );
        }
    });
});


/////////////////////////////////////////////////// EDIT COMMENT
/////////////////////////////////////////////////// Show edit form
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err){
            console.log(err);
            res.redirect("back");
        }else{
            Site.findById(req.params.id, function(err, foundSite){
                if(err){
                    console.log(err);
                }
            });
            res.render("comments/editComment", {site_id: req.params.id, comment: foundComment});
            
        }
    });
});

router.put("/:comment_id", middleWare.checkSiteOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if (err){
           console.log(err);
       }else{
           res.redirect("/sites/"+req.params.id);
       }
   });
});
    


//////////////////////////////////////////////////////Remove comment

router.delete("/:comment_id/delete", middleWare.checkSiteOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
        } else{
            Site.findById(req.params.id, (err, foundSite)=>{
                if(err){
                    console.log(err);
                }else{
                    foundSite.comments.pull({_id : req.params.comment_id});
                    foundSite.save();
                }
            });
            req.flash("success", "Comment deleted!");
            res.redirect("/sites/"+req.params.id);
        }
    });
});

module.exports = router;