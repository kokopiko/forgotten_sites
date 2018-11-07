var mongoose = require("mongoose");
var Comment = require("./comments.js");
var User    = require("./users.js");

//mongoDB connect
mongoose.connect("mongodb://localhost/yelp_camp");

//schema model
var SiteSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    addedBy: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

var Site = mongoose.model("Site", SiteSchema);

module.exports = Site;