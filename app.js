//node setup
var express             = require("express"),
    bodyParser          = require('body-parser'),
    mongoose            = require("mongoose"),
    User                = require("./models/users.js"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    session             = require("express-session"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash");
    var app             = express();
    
    var commentsRoutes  = require("./routes/comments"),
        sitesRoutes     = require("./routes/sites"),
        indexRoutes     = require("./routes/index");

//////////////////////Setup///////////////////////


//db connect//

mongoose.connect('mongodb://localhost/yelp_camp');


//////////////////////express setup///////////////

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
    secret: "dog is not a cat",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

//allows PUT and DELETE thru HTML`s POST method

app.use(methodOverride('_method'));



//passport for authorization

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//global variable to be used by all rendered views

app.use(function(req, res, next){
  res.locals.currentUser    = req.user;
  res.locals.error          = req.flash("error");
  res.locals.success        = req.flash("success");
  next();
});



//routing

app.use("/", indexRoutes);
app.use("/sites", sitesRoutes);
app.use("/sites/:id/comments", commentsRoutes);



///////////////////////////    SERVER LISTENING  ///////////////////////

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is listening.....");
});