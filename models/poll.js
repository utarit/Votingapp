var mongoose = require("mongoose");

var PollSchema = new mongoose.Schema({
    title: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
        
    },
    options: [{
        name: String,
        voting: Number
    }],
});


module.exports = mongoose.model("Poll", PollSchema);