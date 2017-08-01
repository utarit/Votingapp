var Poll = require("../models/poll.js");
var User = require("../models/user.js");

module.exports = {
    checkPollUser: (req, res, next) => {
        if(req.isAuthenticated()){
            Poll.findById(req.params.id, (err, poll) => {
                if(err){
                    console.log(err);
                } else {
                    if(poll.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        //Not same user
                        res.redirect("back");
                    }
                }
            });
        } else {
            //You need to login
            res.redirect("back");
        }
    },
    
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        //You need to login
        res.redirect("back");
    }
};