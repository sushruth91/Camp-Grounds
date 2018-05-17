var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	userName: String,
	password: String
});

// gives the 'UserSchema' inbuilt functionalities of package 'passport-local-mongoose'
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);