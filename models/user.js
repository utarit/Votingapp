var mongoose = require("mongoose");
var passportMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   polls: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Poll"
   }]
});

UserSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", UserSchema);