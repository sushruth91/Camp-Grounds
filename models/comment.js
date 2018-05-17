var mongoose = require("mongoose");

//creating comment schema
var commentSchema =  new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User" //'User' is the model which we want to use
		},
		username: String
	}
});

// 'Comment' is the model name, which will be reflected as 'comments' in mongoDB
module.exports = mongoose.model("Comment", commentSchema);