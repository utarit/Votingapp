var mongoose        = require("mongoose");


var PollSchema = new mongoose.Schema({
   title: String,
   options: [
         {
            name: String,
            voting: Number
         }
      ]
});

module.exports = mongoose.model("Poll", PollSchema);