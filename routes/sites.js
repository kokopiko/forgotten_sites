var express         = require("express"),
    router          = express.Router(),
    Site            = require("../models/sites.js"),
    Comment         = require("../models/comments.js"),
    middleWare      = require("../middleware/index.js");




//////////////////////////////////NEW - show form for new site
router.get("/new", middleWare.checkAuthentication, function(req, res) {
    res.render("sites/newSite"); 
});

//////////////////////////////// POST NEW SITE

router.post("/", middleWare.checkAuthentication, function (req, res){
    var newSite = req.body.site;
    newSite.addedBy = req.user;
    Site.create(newSite, function(err, site){
        if (err){
        console.log("something wrong");
        console.log(err);
    }else{
        req.flash("success", "Site added!");
        res.redirect("sites");
    }});
    
});


//////////////////////////////////SHOW - shows particular site details

router.get("/:id", function (req, res){
   Site.findById(req.params.id)
   .populate("addedBy")
   .populate({ 
       path: 'comments',
      populate: {
          path: 'author',
      }
   })
   .exec(function (err, foundSite){
     if (err){
         console.log("Error occured during Finding Site by ID");
         res.redirect("/sites");
     }else{
         res.render("sites/showSite", {site: foundSite});
     }
   });
});

//////////////////////////////////EDIT - show edit form for a site

router.get("/:id/edit", middleWare.checkSiteOwnership, function(req, res) {
    Site.findById(req.params.id, function(err, foundSite) {
        if (err){
            console.log(err);
        } else {
            res.render("sites/editSite", {site: foundSite});
        }
    });
});

/////////////////////////////////////UPDATE - update POSTed data by PUT method to DB 
router.put("/:id", middleWare.checkSiteOwnership, function(req, res){
   Site.findByIdAndUpdate(req.params.id, req.body.site, function(err, data){
       if (err){
           console.log(err);
       } else {
           req.flash("success", "Site edited!");
           res.redirect("/sites/"+req.params.id);
       }
   }) ;
});

/////////////////////////////////////DELETE - delete site from DB by DELETE method
router.delete("/:id/delete", middleWare.checkSiteOwnership, function(req, res){
    if (req.isAuthenticated()){
        Site.findByIdAndRemove(req.params.id, function(err, foundSite){
            if (err){
                console.log(err);
            } else {
                //removes all comments from db.comments
                foundSite.comments.forEach(function(item){
                    Comment.findByIdAndRemove(item._id, function(err){
                        if (err){
                            console.log(err);
                        }
                    });
                });
                req.flash("success", "Site deleted!");
                res.redirect("/sites");
            }
        });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;