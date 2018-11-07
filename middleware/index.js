var     Site            = require("../models/sites.js"),
        Comment         = require("../models/comments.js");
        

var middleWare = {};

middleWare.checkSiteOwnership = function (req, res, next){
  //check for site ownership
  if (req.isAuthenticated()){
      Site.findById(req.params.id, function(err, foundSite) {
          if(err){
              console.log(err);
          } else {
              if(foundSite.addedBy._id.equals(req.user.id)){
                console.log("user id === author id");
                next();
              } else {
                  res.redirect("back");
              }
          }
      });
  }
};

middleWare.checkCommentOwnership = function(req, res, next){
  //check for comment ownership
  if (req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment) {
          if(err){
              console.log(err);
          } else {
              if(foundComment.author._id.equals(req.user.id)){
                next();
              } else {
                  res.redirect("back");
              }
          }
      })}
};


middleWare.checkAuthentication = function(req, res, next){
    if (req.isAuthenticated()){
        console.log("authentication confirmed, passing through....");
        next();
    } else {
        console.log("not anthenticated, redirecting....");
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
};

module.exports = middleWare;