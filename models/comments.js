var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
        content: String,
        date:   Date,
        author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
        }
});

var Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;