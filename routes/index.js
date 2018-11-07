var express             = require("express"),
    router              = express.Router(),
    Site                = require("../models/sites.js"),
    User                = require("../models/users.js"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local");
    
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use(function(req, res, next) {
    console.log("Browser request:", req.method, req.url);
    next(); 
});


/////////////////////////// ROUTING ///////////////////////////


////////////////////////////////INDEX
router.get("/", function(req, res){
    res.redirect("sites");
});

//////////////////////////////// SITES
router.get("/sites", function(req, res){
    Site.find({}, function(err, sites){
       if (err){
           console.log("error while getting from DB");
       }else{
           res.render("showAll", {sites: sites});
       }
    });
    
});




////////////////////////////////////////////////////////////////
//////////////////////////////// SHOW LOGIN FORM
////////////////////////////////////////////////////////////////


router.get("/login", function(req, res){
    res.render("auth/login");
});

////////////////////////////////////////////////////////////////
//////////////////////////////// SHOW REGISTER FORM
////////////////////////////////////////////////////////////////

router.get("/register", function(req, res){
    res.render("auth/register");
});

////////////////////////////////////////////////////////////////
//////////////////////////////// POST REGISTER
////////////////////////////////////////////////////////////////

router.post("/register", function (req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           res.redirect("/register");
       } else {
           passport.authenticate('local')(req, res, function () {
               req.flash("success", "Welcome "+req.user.username);
               res.redirect('/sites');
               console.log("Registration successful");
           });
   }});
});

////////////////////////////////////////////////////////////////
//////////////////////////////// POST LOGIN
////////////////////////////////////////////////////////////////

router.post("/login", passport.authenticate("local", {
    successRedirect: "/sites",
    failureRedirect: "/login",
    failureFlash : true
}), function (req, res){
    
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/sites");
});

module.exports = router;